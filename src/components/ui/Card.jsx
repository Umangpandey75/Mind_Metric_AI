import { clsx } from 'clsx'

export default function Card({
  children,
  hover     = false,
  border    = true,
  padding   = true,
  rounded   = 'xl',
  className = '',
  onClick,
  id,
}) {
  const roundedClass = {
    md:  'rounded-md',
    lg:  'rounded-lg',
    xl:  'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }[rounded] ?? 'rounded-xl'

  return (
    <div
      id={id}
      onClick={onClick}
      className={clsx(
        // Base surface
        'bg-cardLight dark:bg-cardDark',
        roundedClass,

        // Border
        border && 'border border-gray-200/80 dark:border-gray-700/50',

        // Padding
        padding && 'p-6',

        // Hover effect
        hover && [
          'transition-all duration-300 ease-in-out',
          'hover:-translate-y-1 hover:shadow-xl',
          'hover:shadow-primary/10 dark:hover:shadow-primaryDark/10',
          'hover:border-primary/30 dark:hover:border-primaryDark/30',
        ],

        // Clickable cursor
        onClick && 'cursor-pointer',

        className,
      )}
    >
      {children}
    </div>
  )
}
