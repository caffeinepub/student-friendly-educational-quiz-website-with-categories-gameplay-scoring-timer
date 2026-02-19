interface EduIconProps {
  icon: 'book' | 'pencil' | 'microscope' | 'calculator' | 'globe' | 'lightbulb';
  className?: string;
}

const iconMap = {
  book: '📚',
  pencil: '✏️',
  microscope: '🔬',
  calculator: '🧮',
  globe: '🌍',
  lightbulb: '💡',
};

export default function EduIcon({ icon, className = '' }: EduIconProps) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="img" aria-label={icon}>
      {iconMap[icon]}
    </span>
  );
}
