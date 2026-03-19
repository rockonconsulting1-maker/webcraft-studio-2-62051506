
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, light, centered = true }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} max-w-3xl mx-auto`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-[#002366]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? 'text-gray-200' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-20 mt-6 bg-[#00A651] ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeader;
