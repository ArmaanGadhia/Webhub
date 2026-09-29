import React from 'react';
import * as Icons from 'lucide-react';

export default function CategoryIcon({ name, className = 'w-5 h-5' }) {
  const IconComponent = Icons[name] || Icons.Briefcase;
  return <IconComponent className={className} />;
}
