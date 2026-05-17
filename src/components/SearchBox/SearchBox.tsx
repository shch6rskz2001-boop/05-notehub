import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className={css.searchWrapper}>
      <input
        type="text"
        className={css.input}
        placeholder="Пошук нотаток..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
