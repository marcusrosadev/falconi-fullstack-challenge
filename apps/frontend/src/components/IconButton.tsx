'use client'

import { ReactNode, useState } from 'react'

interface IconButtonProps {
  icon: ReactNode
  onClick: () => void
  tooltip: string
  variant?: 'edit' | 'delete' | 'activate' | 'deactivate' | 'add'
  className?: string
}

export default function IconButton({
  icon,
  onClick,
  tooltip,
  variant = 'edit',
  className = '',
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case 'edit':
        return 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
      case 'delete':
        return 'text-red-600 hover:text-red-800 hover:bg-red-50'
      case 'activate':
        return 'text-green-600 hover:text-green-800 hover:bg-green-50'
      case 'deactivate':
        return 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
      case 'add':
        return 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
      default:
        return 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`p-2 rounded-md transition-all duration-200 ${getVariantStyles()} ${className}`}
        aria-label={tooltip}
      >
        {icon}
      </button>
      {showTooltip && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

