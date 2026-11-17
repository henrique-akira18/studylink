import { useState } from 'react';

const MAX_ITEMS = 50;
const MAX_LENGTH = 100;

export default function TagInput({
  id,
  label,
  value = [],
  onChange,
  placeholder = 'Digite e pressione Enter',
  suggestions = [],
  hint,
}) {
  const [draft, setDraft] = useState('');

  function addTag(rawValue) {
    const items = rawValue
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const next = [...value];

    for (const item of items) {
      if (next.length >= MAX_ITEMS || item.length > MAX_LENGTH) break;
      if (next.some((tag) => tag.toLocaleLowerCase() === item.toLocaleLowerCase())) continue;
      next.push(item);
    }

    onChange(next);
    setDraft('');
  }

  function removeTag(index) {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (draft.trim()) addTag(draft);
    }

    if (event.key === 'Backspace' && !draft && value.length) {
      removeTag(value.length - 1);
    }
  }

  const availableSuggestions = suggestions.filter(
    (suggestion) =>
      !value.some(
        (tag) => tag.toLocaleLowerCase() === suggestion.toLocaleLowerCase(),
      ),
  );

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="tag-input">
        {value.map((tag, index) => (
          <span className="tag tag-removable" key={`${tag}-${index}`}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              aria-label={`Remover ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft.trim() && addTag(draft)}
          placeholder={value.length ? '' : placeholder}
          disabled={value.length >= MAX_ITEMS}
        />
      </div>

      {availableSuggestions.length > 0 && (
        <div className="suggestions">
          {availableSuggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              className="suggestion"
              onClick={() => addTag(suggestion)}
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}

      {hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}
