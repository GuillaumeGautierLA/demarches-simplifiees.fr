import React, {
  useMemo,
  useState,
  useRef,
  useContext,
  createContext,
  useEffect,
  useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import matchSorter from 'match-sorter';
import { fire } from '@utils';

const Context = createContext();

function ComboMultipleDropdownListWithArrayOptions({ arrayOptions, hiddenFieldId, selected }) {
  const inputRef = useRef();
  const [term, setTerm] = useState('');
  const [selections, setSelections] = useState(selected);
  const results = useMemo(
    () =>
      (term
        ? matchSorter(
            arrayOptions.filter((o) => !o[0].startsWith('--')),
            term
          )
        : arrayOptions
      ).filter((o) => o[0] && !selections.includes(o[1])),
    [term, selections]
  );
  const hiddenField = useMemo(
    () => document.querySelector(`input[data-uuid="${hiddenFieldId}"]`),
    [hiddenFieldId]
  );

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const saveSelection = (selections) => {
    setSelections(selections);
    if (hiddenField) {
      hiddenField.setAttribute('value', JSON.stringify(selections));
      fire(hiddenField, 'autosave:trigger');
    }
  };

  const onSelect = (value) => {
    let sel = arrayOptions.find((o) => o[0] == value)[1];
    saveSelection([...selections, sel]);
    setTerm('');
  };

  const onRemove = (value) => {
    saveSelection(selections.filter((s) => s !== (arrayOptions.find((o) => o[0] == value)[1])));
    inputRef.current.focus();
  };


  return (
    <Combobox
      openOnFocus={true}
      onSelect={onSelect}
      aria-label="choisir une option"
    >
      <ComboboxTokenLabel
        onRemove={onRemove}
        style={{
          border: "10px solid #888"
        }}
      >
        <ul
          aria-live="polite"
          aria-atomic={true}
          data-reach-combobox-token-list
        >
          {selections.map((selection) => (
            <ComboboxToken key={selection} value={arrayOptions.find((o) => o[1] == selection)[0]}/>
          ))}
        </ul>
        <ComboboxInput
          ref={inputRef}
          value={term}
          onChange={handleChange}
          autocomplete={false}
          style={{
            outline: 'none',
            border: 'none',
            flexGrow: 1,
            margin: '0.25rem',
            font: 'inherit'
          }}
        />
      </ComboboxTokenLabel>
      {results && (
        <ComboboxPopover>
          {results.length === 0 && (
            <p>
              Aucun résultat{' '}
              <button
                onClick={() => {
                  setTerm('');
                }}
              >
                Effacer
              </button>
            </p>
          )}
          <ComboboxList>
            {results.map((value, index) => {
              if (value[0].startsWith('--')) {
                return <ComboboxSeparator key={index} value={value[0]} />;
              }
              return <ComboboxOption key={index} value={value[0]} />;
            })}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  );
}

////////////////////////////////////////////////////////////////////////////////

function ComboboxTokenLabel({ onRemove, ...props }) {
  const selectionsRef = useRef([]);

  useLayoutEffect(() => {
    selectionsRef.current = [];
    return () => (selectionsRef.current = []);
  });

  const context = {
    onRemove,
    selectionsRef
  };

  return (
    <Context.Provider value={context}>
      <div data-combobox-token-label {...props} />
    </Context.Provider>
  );
}

ComboboxTokenLabel.propTypes = {
  onRemove: PropTypes.func
};

function ComboboxSeparator({ value }) {
  return (
    <li role="option" data-reach-combobox-option>
      {value.slice(2, -2)}
    </li>
  );
}

ComboboxSeparator.propTypes = {
  value: PropTypes.string
};

function ComboboxToken({ value, ...props }) {
  const { selectionsRef, onRemove } = useContext(Context);
  useEffect(() => {
    selectionsRef.current.push(value);
  });

  return (
    <li
      data-reach-combobox-token
      tabIndex="0"
      onKeyDown={(event) => {
        if (event.key === 'Backspace') {
          onRemove(value);
        }
      }}
      {...props}
    >
      {value}
    </li>
  );
}

ComboboxToken.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string
};

ComboMultipleDropdownListWithArrayOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  arrayOptions: PropTypes.arrayOf(PropTypes.array),
  hiddenFieldId: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.string),
  arraySelected: PropTypes.arrayOf(PropTypes.array)
};

export default ComboMultipleDropdownListWithArrayOptions;
