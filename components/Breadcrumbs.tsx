"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    if (paths.length === 0) {
      return [{ name: 'Dashboard', href: '/', current: true }];
    }

    const breadcrumbs = [
      { name: 'Dashboard', href: '/', current: false }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === paths.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          {index === 0 ? (
            <Link
              href={breadcrumb.href}
              className="flex items-center hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <ChevronRight className="w-4 h-4" />
              {breadcrumb.current ? (
                <span className="text-gray-900 font-medium">{breadcrumb.name}</span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="hover:text-primary-600 transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
