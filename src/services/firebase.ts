import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  doc, 
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setLogLevel
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Property, UserProfile, UserRole, AdminEmailNotification } from "../types/property";

// Suppress internal Firestore connection spam (e.g. when database is offline or not yet initialized in console)
setLogLevel('silent');

// Web app's Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyBhKKGjevMphV31SXsG8u4QPvjlFMxEsQk",
  authDomain: "villasell-realestate.firebaseapp.com",
  projectId: "villasell-realestate",
  storageBucket: "villasell-realestate.firebasestorage.app",
  messagingSenderId: "1021848342667",
  appId: "1:1021848342667:web:f57b2393c31bb4ce22848e",
  measurementId: "G-DMGTYM4MH4"
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Firestore with long-polling to prevent WebChannel / gRPC connection drops and "Failed to fetch" errors
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true
  });
} catch {
  dbInstance = getFirestore(app);
}
export const db = dbInstance;

// Initialize analytics safely if browser environment supports it
let analyticsInstance: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-supported environments
  });
}
export const analytics = analyticsInstance;

// Helper to convert Firebase user to app's UserProfile
export const mapFirebaseUser = (user: FirebaseUser, extraData?: Partial<UserProfile>): UserProfile => {
  return {
    name: user.displayName || extraData?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    phone: user.phoneNumber || extraData?.phone || "+91 83838 26205",
    role: (extraData?.role as any) || "Buyer",
    avatar: user.photoURL || extraData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    city: extraData?.city || "Bangalore"
  };
};

/**
 * Sign Up with Email and Password
 */
export const registerWithEmail = async (
  email: string, 
  pass: string, 
  name: string, 
  phone?: string, 
  role: 'Buyer' | 'Owner' | 'Agent' | 'Admin' = 'Buyer'
): Promise<UserProfile> => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && cred.user) {
    try {
      await updateProfile(cred.user, { displayName: name });
    } catch (e) {
      // non-blocking
    }
  }

  const userProfile: UserProfile = {
    name: name || email.split("@")[0],
    email,
    phone: phone || "+91 83838 26205",
    role,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  };

  // Optionally store user document in users collection without blocking if Firestore is unavailable
  try {
    const savePromise = setDoc(doc(db, "users", cred.user.uid), {
      ...userProfile,
      uid: cred.user.uid,
      createdAt: serverTimestamp()
    });
    const timeout = new Promise((_, reject) => setTimeout(() => reject('timeout'), 2500));
    await Promise.race([savePromise, timeout]);
  } catch (err) {
    // Non-blocking fallback
  }

  return userProfile;
};

/**
 * Log In with Email and Password
 */
export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  
  // Try retrieving role from Firestore if stored
  let extraRole: any = null;
  try {
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      extraRole = snap.data().role;
    }
  } catch (e) {
    // ignore
  }

  return mapFirebaseUser(cred.user, { role: extraRole });
};

/**
 * Sign In with Google
 */
export const loginWithGoogle = async (): Promise<{ user: UserProfile; isNewUser: boolean }> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  const fbUser = cred.user;

  let savedRole: 'Buyer' | 'Owner' | 'Agent' | 'Admin' | null = null;
  let isNew = false;

  try {
    const snap = await getDoc(doc(db, "users", fbUser.uid));
    if (snap.exists()) {
      savedRole = snap.data().role;
    } else {
      isNew = true;
    }
  } catch (e) {
    // If Firestore lookup times out or fails, check localStorage
    try {
      const cached = localStorage.getItem('villasell_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.email === fbUser.email) {
          savedRole = parsed.role;
        }
      }
    } catch {}
  }

  const userProfile: UserProfile = {
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Google User",
    email: fbUser.email || "",
    phone: fbUser.phoneNumber || "+91 83838 26205",
    role: savedRole || 'Buyer',
    avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    city: "Bangalore",
    pendingRoleSelection: isNew || !savedRole
  };

  // Save to Firestore if user exists
  if (!isNew && savedRole) {
    try {
      await setDoc(doc(db, "users", fbUser.uid), {
        ...userProfile,
        uid: fbUser.uid,
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (e) {}
  }

  return { user: userProfile, isNewUser: userProfile.pendingRoleSelection || false };
};

/**
 * Update user role and profile in Firestore
 */
export const updateUserProfileInFirestore = async (
  uidOrEmail: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid || uidOrEmail;
  if (!uid) return;

  try {
    await setDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore user update notice:", e);
  }
};

/**
 * Log out from Firebase Auth
 */
export const logoutFromFirebase = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Listen for Firebase Auth state changes
 */
export const onAuthStatusChanged = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      callback(mapFirebaseUser(fbUser));
    } else {
      callback(null);
    }
  });
};

/**
 * Deduplicate property list by canonical ID and property identity fingerprint
 */
export const deduplicatePropertyList = (list: Property[]): Property[] => {
  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const result: Property[] = [];

  for (const prop of list) {
    if (!prop || !prop.id) continue;
    if (seenIds.has(prop.id)) continue;

    // Build unique fingerprint based on property content
    const title = (prop.title || '').trim().toLowerCase();
    const city = (prop.city || '').trim().toLowerCase();
    const loc = (prop.locality || '').trim().toLowerCase();
    const price = (prop.priceDisplay || prop.price || '').toString().trim().toLowerCase();
    const fp = `${title}|${city}|${loc}|${price}`;

    if (fp.length > 6 && seenFingerprints.has(fp)) {
      // Duplicate listing with different ID - skip duplicate
      continue;
    }

    seenIds.add(prop.id);
    if (fp.length > 6) {
      seenFingerprints.add(fp);
    }
    result.push(prop);
  }

  return result;
};

/**
 * Save new property with immediate local cache + safe Firestore persistence
 * Uses property.id as the permanent Firestore document ID to prevent duplicate IDs.
 */
export const savePropertyToFirestore = async (property: Property): Promise<string> => {
  // Always immediately persist in localStorage with deduplication
  try {
    const existingStr = localStorage.getItem('villasell_custom_properties');
    const existing: Property[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = deduplicatePropertyList([property, ...existing.filter(p => p.id !== property.id)]);
    localStorage.setItem('villasell_custom_properties', JSON.stringify(updated));
  } catch (e) {
    console.warn('Local cache save notice:', e);
  }

  // Attempt Firestore write using setDoc with exact property.id
  try {
    const propertyRef = doc(db, "properties", property.id);
    const writePromise = setDoc(propertyRef, {
      ...property,
      createdAtTimestamp: serverTimestamp(),
      createdAt: property.createdAt || new Date().toISOString().split("T")[0]
    }).then(() => property.id);

    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), 3000);
    });

    await Promise.race([writePromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firestore setDoc notice (using offline local storage):', err);
  }

  return property.id;
};

/**
 * Safe live subscriber with local cache fallback, deduplication, and suppression of deleted items
 */
export const subscribeToFirestoreProperties = (
  onData: (properties: Property[]) => void,
  onError?: (err: Error) => void
) => {
  const getDeletedIds = (): Set<string> => {
    try {
      const deletedStr = localStorage.getItem('villasell_deleted_properties');
      return new Set(deletedStr ? JSON.parse(deletedStr) : []);
    } catch {
      return new Set();
    }
  };

  // Helper to read cached custom properties cleanly
  const getCachedProperties = (): Property[] => {
    try {
      const cached = localStorage.getItem('villasell_custom_properties');
      const parsed: Property[] = cached ? JSON.parse(cached) : [];
      const deleted = getDeletedIds();
      const filtered = parsed.filter((p) => !deleted.has(p.id));
      const deduped = deduplicatePropertyList(filtered);
      if (deduped.length !== parsed.length) {
        localStorage.setItem('villasell_custom_properties', JSON.stringify(deduped));
      }
      return deduped;
    } catch {
      return [];
    }
  };

  // Provide local cached properties immediately
  const localProps = getCachedProperties();
  if (localProps.length > 0) {
    onData(localProps);
  }

  let isSubscribed = true;
  let unsubscribeSnapshot: (() => void) | null = null;

  try {
    const q = query(collection(db, "properties"));
    
    unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;
        const deleted = getDeletedIds();
        const items: Property[] = [];
        snapshot.forEach((d) => {
          if (!deleted.has(d.id)) {
            const data = d.data();
            items.push({
              ...(data as Property),
              id: d.id
            });
          }
        });

        // Merge with local custom properties & deduplicate completely
        const cached = getCachedProperties();
        const combined = deduplicatePropertyList([...items, ...cached]);
        onData(combined);
      },
      (error) => {
        if (unsubscribeSnapshot) {
          try {
            unsubscribeSnapshot();
          } catch {
            // ignore
          }
          unsubscribeSnapshot = null;
        }

        // Seamlessly fallback to cached properties
        onData(getCachedProperties());
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    onData(getCachedProperties());
    if (onError) onError(err);
  }

  return () => {
    isSubscribed = false;
    if (unsubscribeSnapshot) {
      try {
        unsubscribeSnapshot();
      } catch {
        // ignore
      }
      unsubscribeSnapshot = null;
    }
  };
};

/**
 * Update property details or approvalStatus in Firestore & local cache
 */
export const updatePropertyInFirestore = async (
  propertyId: string, 
  updates: Partial<Property>
): Promise<void> => {
  // Update local storage cache immediately
  try {
    const existingStr = localStorage.getItem('villasell_custom_properties');
    if (existingStr) {
      const existing: Property[] = JSON.parse(existingStr);
      const updated = existing.map((p) => (p.id === propertyId ? { ...p, ...updates } : p));
      localStorage.setItem('villasell_custom_properties', JSON.stringify(deduplicatePropertyList(updated)));
    }
  } catch (e) {
    console.warn('Local property update notice:', e);
  }

  // Attempt Firestore update
  try {
    const propertyRef = doc(db, "properties", propertyId);
    await updateDoc(propertyRef, {
      ...updates,
      updatedAtTimestamp: serverTimestamp()
    });
  } catch (err) {
    console.warn("Firestore updateDoc notice (offline or not found):", err);
  }
};

/**
 * Delete property from Firestore, local storage, and delete associated Admin Email Alerts
 */
export const deletePropertyFromFirestore = async (propertyId: string): Promise<void> => {
  // 1. Remove from local storage cache
  try {
    const existingStr = localStorage.getItem('villasell_custom_properties');
    if (existingStr) {
      const existing: Property[] = JSON.parse(existingStr);
      const filtered = existing.filter((p) => p.id !== propertyId);
      localStorage.setItem('villasell_custom_properties', JSON.stringify(filtered));
    }

    // Track in deleted list so it will never reappear
    const deletedStr = localStorage.getItem('villasell_deleted_properties');
    const deleted: string[] = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deleted.includes(propertyId)) {
      deleted.push(propertyId);
      localStorage.setItem('villasell_deleted_properties', JSON.stringify(deleted));
    }
  } catch (e) {
    console.warn('Local property delete notice:', e);
  }

  // 2. Automatically delete associated Admin Email Alert
  try {
    await deleteAdminNotificationByPropertyId(propertyId);
  } catch (e) {
    console.warn('Error deleting associated notification on property delete:', e);
  }

  // 3. Attempt Firestore deleteDoc
  try {
    await deleteDoc(doc(db, "properties", propertyId));
  } catch (err) {
    console.warn("Firestore deleteDoc notice:", err);
  }
};

/**
 * Record & dispatch an Admin Email Notification for new post-property approval request
 */
export const recordAdminEmailNotification = async (
  notification: AdminEmailNotification
): Promise<void> => {
  // 1. Save to local storage with deduplication
  try {
    const existingStr = localStorage.getItem('villasell_admin_notifications');
    const existing: AdminEmailNotification[] = existingStr ? JSON.parse(existingStr) : [];
    // Ensure no duplicate notification for the same propertyId
    const filtered = existing.filter(n => n.propertyId !== notification.propertyId && n.id !== notification.id);
    const updated = [notification, ...filtered];
    localStorage.setItem('villasell_admin_notifications', JSON.stringify(updated));
  } catch (e) {
    console.warn('Admin notification cache notice:', e);
  }

  // 2. Save to Firestore admin_notifications collection
  try {
    await setDoc(doc(db, "admin_notifications", notification.id), {
      ...notification,
      createdAtTimestamp: serverTimestamp()
    });
  } catch (e) {
    console.warn('Firestore notification write notice:', e);
  }
};

/**
 * Delete admin notification by its ID
 */
export const deleteAdminNotificationById = async (notifId: string): Promise<void> => {
  try {
    const existingStr = localStorage.getItem('villasell_admin_notifications');
    if (existingStr) {
      const existing: AdminEmailNotification[] = JSON.parse(existingStr);
      const filtered = existing.filter((n) => n.id !== notifId);
      localStorage.setItem('villasell_admin_notifications', JSON.stringify(filtered));
    }
  } catch (e) {
    console.warn('Local notification delete notice:', e);
  }

  try {
    await deleteDoc(doc(db, "admin_notifications", notifId));
  } catch (e) {
    console.warn('Firestore notification delete notice:', e);
  }
};

/**
 * Delete admin notification associated with a specific property ID
 */
export const deleteAdminNotificationByPropertyId = async (propertyId: string): Promise<void> => {
  try {
    const existingStr = localStorage.getItem('villasell_admin_notifications');
    if (existingStr) {
      const existing: AdminEmailNotification[] = JSON.parse(existingStr);
      const filtered = existing.filter((n) => n.propertyId !== propertyId && n.id !== propertyId && !n.id.includes(propertyId));
      localStorage.setItem('villasell_admin_notifications', JSON.stringify(filtered));
    }
  } catch (e) {
    console.warn('Local notification delete by propertyId notice:', e);
  }

  try {
    const q = query(collection(db, "admin_notifications"), where("propertyId", "==", propertyId));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (d) => {
      try {
        await deleteDoc(d.ref);
      } catch {
        // ignore
      }
    });
  } catch (e) {
    console.warn('Firestore notification delete by propertyId notice:', e);
  }
};

/**
 * Retrieve saved admin notifications, filtering out any for deleted properties
 */
export const getAdminEmailNotifications = (): AdminEmailNotification[] => {
  try {
    const deletedStr = localStorage.getItem('villasell_deleted_properties');
    const deleted: string[] = deletedStr ? JSON.parse(deletedStr) : [];
    const deletedSet = new Set(deleted);

    const existingStr = localStorage.getItem('villasell_admin_notifications');
    const existing: AdminEmailNotification[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Filter out deleted properties & deduplicate by propertyId
    const seenPropIds = new Set<string>();
    const deduped: AdminEmailNotification[] = [];

    for (const notif of existing) {
      if (deletedSet.has(notif.propertyId) || deletedSet.has(notif.id)) continue;
      if (seenPropIds.has(notif.propertyId)) continue;
      seenPropIds.add(notif.propertyId);
      deduped.push(notif);
    }

    if (deduped.length !== existing.length) {
      localStorage.setItem('villasell_admin_notifications', JSON.stringify(deduped));
    }

    return deduped;
  } catch {
    return [];
  }
};

/**
 * Synchronize, clean, and refresh Admin Email Notifications from Firestore & Local Storage
 */
export const fetchAndCleanAdminNotifications = async (
  currentProperties?: Property[]
): Promise<AdminEmailNotification[]> => {
  const localList = getAdminEmailNotifications();
  const deletedStr = localStorage.getItem('villasell_deleted_properties');
  const deleted: string[] = deletedStr ? JSON.parse(deletedStr) : [];
  const deletedSet = new Set(deleted);

  // If currentProperties is supplied, also check if properties were deleted
  const currentPropertyIds = currentProperties ? new Set(currentProperties.map(p => p.id)) : null;

  let firestoreList: AdminEmailNotification[] = [];
  try {
    const q = query(collection(db, "admin_notifications"));
    const snapshotPromise = getDocs(q);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
    const result = await Promise.race([snapshotPromise, timeoutPromise]);

    if (result && 'forEach' in result) {
      result.forEach((d) => {
        const data = d.data() as AdminEmailNotification;
        firestoreList.push({
          ...data,
          id: d.id
        });
      });
    }
  } catch (err) {
    console.warn('Firestore fetch notifications notice:', err);
  }

  // Combine and deduplicate
  const combined = [...firestoreList, ...localList];
  const seenPropIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const cleaned: AdminEmailNotification[] = [];

  for (const notif of combined) {
    if (!notif || !notif.propertyId) continue;
    if (deletedSet.has(notif.propertyId) || deletedSet.has(notif.id)) continue;
    if (seenPropIds.has(notif.propertyId)) continue;

    // Build fingerprint
    const fp = `${(notif.propertyTitle || '').trim().toLowerCase()}|${(notif.propertyLocality || '').trim().toLowerCase()}|${(notif.propertyPrice || '').trim().toLowerCase()}`;
    if (fp.length > 5 && seenFingerprints.has(fp)) continue;

    seenPropIds.add(notif.propertyId);
    if (fp.length > 5) seenFingerprints.add(fp);
    cleaned.push(notif);
  }

  try {
    localStorage.setItem('villasell_admin_notifications', JSON.stringify(cleaned));
  } catch {
    // ignore
  }

  return cleaned;
};

/**
 * Update notification approval status
 */
export const updateNotificationStatus = (
  propertyId: string, 
  status: 'approved' | 'rejected'
): void => {
  try {
    const existingStr = localStorage.getItem('villasell_admin_notifications');
    if (existingStr) {
      const existing: AdminEmailNotification[] = JSON.parse(existingStr);
      const updated = existing.map(n => n.propertyId === propertyId ? { ...n, status } : n);
      localStorage.setItem('villasell_admin_notifications', JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Notification status update notice:', e);
  }
};
