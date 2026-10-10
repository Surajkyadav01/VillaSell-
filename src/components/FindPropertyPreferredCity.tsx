import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

export interface PreferredCityItem {
  id: string;
  name: string;
  count: string;
  imageUrl: string;
  filterValue: string;
}

// Fallback high-res landmark photos in case local file loading is blocked or delayed
const CITY_FALLBACKS: Record<string, string> = {
  lucknow: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=300&q=80',
  prayagraj: 'https://images.unsplash.com/photo-1623880840003-889417865c3b?auto=format&fit=crop&w=300&q=80',
  mirzapur: 'https://vindhyatirthparishad.org/assets/img/1.jpg',
  bhadohi: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=300&q=80',
  jaunpur: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Shahi_bridge%2C_Jaunpur.jpg',
  noida: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80',
  gurgaon: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=300&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=300&q=80',
  pune: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=300&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=300&q=80',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=300&q=80',
  ahmedabad: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
  thane: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80',
  chandigarh: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80',
};

// Top cities: Exactly 12 cities (2 neat rows of 6 on desktop lg:grid-cols-6)
export const PREFERRED_CITIES_LIST: PreferredCityItem[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    count: '34726 + Properties',
    imageUrl: 'images/cities/mumbai.webp',
    filterValue: 'Mumbai'
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    count: '38450 + Properties',
    imageUrl: 'images/cities/lucknow.webp',
    filterValue: 'Lucknow'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    count: '32180 + Properties',
    imageUrl: 'images/cities/varanasi.webp',
    filterValue: 'Varanasi'
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    count: '28940 + Properties',
    imageUrl: 'images/cities/prayagraj.webp',
    filterValue: 'Prayagraj'
  },
  {
    id: 'mirzapur',
    name: 'Mirzapur',
    count: '14250 + Properties',
    imageUrl: 'images/cities/mirzapur.webp?v=vindhyachal',
    filterValue: 'Mirzapur'
  },
  {
    id: 'bhadohi',
    name: 'Bhadohi',
    count: '11840 + Properties',
    imageUrl: 'images/cities/bhadohi.webp?v=carpet',
    filterValue: 'Bhadohi'
  },
  {
    id: 'jaunpur',
    name: 'Jaunpur',
    count: '13670 + Properties',
    imageUrl: 'images/cities/jaunpur.webp',
    filterValue: 'Jaunpur'
  },
  {
    id: 'noida',
    name: 'Noida',
    count: '34120 + Properties',
    imageUrl: 'images/cities/noida.webp',
    filterValue: 'Noida'
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    count: '35049 + Properties',
    imageUrl: 'images/cities/gurgaon.webp',
    filterValue: 'Gurgaon'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    count: '31496 + Properties',
    imageUrl: 'images/cities/delhi.webp',
    filterValue: 'Delhi'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    count: '36018 + Properties',
    imageUrl: 'images/cities/bangalore.webp',
    filterValue: 'Bangalore'
  },
  {
    id: 'pune',
    name: 'Pune',
    count: '29506 + Properties',
    imageUrl: 'images/cities/pune.webp',
    filterValue: 'Pune'
  }
];

// Additional cities shown when expanding 'View More Cities' (Hyderabad, Chennai, Kolkata moved here as requested)
export const ADDITIONAL_CITIES_LIST: PreferredCityItem[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    count: '18794 + Properties',
    imageUrl: 'images/cities/hyderabad.webp',
    filterValue: 'Hyderabad'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    count: '22168 + Properties',
    imageUrl: 'images/cities/chennai.webp',
    filterValue: 'Chennai'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    count: '12540 + Properties',
    imageUrl: 'images/cities/kolkata.webp',
    filterValue: 'Kolkata'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    count: '10038 + Properties',
    imageUrl: 'images/cities/ahmedabad.webp',
    filterValue: 'Ahmedabad'
  },
  {
    id: 'thane',
    name: 'Thane',
    count: '17442 + Properties',
    imageUrl: 'images/cities/thane.webp',
    filterValue: 'Thane'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    count: '8950 + Properties',
    imageUrl: 'images/cities/jaipur.webp',
    filterValue: 'Jaipur'
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    count: '7910 + Properties',
    imageUrl: 'images/cities/chandigarh.webp',
    filterValue: 'Chandigarh'
  }
];

interface FindPropertyPreferredCityProps {
  onSelectCity: (cityName: string) => void;
}

export const FindPropertyPreferredCity: React.FC<FindPropertyPreferredCityProps> = ({
  onSelectCity,
}) => {
  const [showMore, setShowMore] = useState(false);

  const displayedCities = showMore
    ? [...PREFERRED_CITIES_LIST, ...ADDITIONAL_CITIES_LIST]
    : PREFERRED_CITIES_LIST;

  return (
    <section className="bg-white py-10 sm:py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Exact Red Heading matching image.png: Clean regular-weight sans-serif with deep crimson tone */}
        <div className="text-center mb-9 sm:mb-11">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-normal sm:font-medium text-[#a31515] tracking-normal font-sans">
            Find Your Property in Your Preferred City
          </h2>
        </div>

        {/* 6 columns per row on desktop (exactly 2 rows for 12 cities), responsive 3-column layout on mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2.5 sm:gap-x-6 gap-y-6 sm:gap-y-9 justify-items-center">
          {displayedCities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city.filterValue)}
              className="group flex flex-col items-center text-center cursor-pointer select-none transition-all duration-200 hover:-translate-y-1 active:scale-95 focus:outline-none w-full max-w-[155px]"
              title={`View all properties in ${city.name}`}
            >
              {/* Compact circular landmark photo */}
              <div className="relative w-[68px] h-[68px] sm:w-[86px] sm:h-[86px] rounded-full overflow-hidden border border-slate-200/90 shadow-xs group-hover:shadow-md group-hover:border-[#a31515] transition-all duration-300 bg-slate-100">
                <img
                  src={getAssetUrl(city.imageUrl)}
                  alt={city.name}
                  width="86"
                  height="86"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  onError={(e) => {
                    const fallback = CITY_FALLBACKS[city.id];
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>

              {/* City Name */}
              <h3 className="font-semibold text-[13px] sm:text-base text-slate-800 group-hover:text-[#a31515] transition-colors mt-2 sm:mt-2.5 tracking-normal line-clamp-1">
                {city.name}
              </h3>

              {/* Property Count */}
              <p className="text-[11px] sm:text-[13px] text-slate-500 font-normal tracking-tight mt-0.5 whitespace-nowrap">
                {city.count}
              </p>
            </button>
          ))}
        </div>

        {/* Exact View More Cities Pill Button */}
        <div className="mt-8 sm:mt-11 text-center">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-2 rounded-full border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>{showMore ? 'Show Less Cities' : 'View More Cities'}</span>
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
};
