import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";

const fetchSuggestionFromApi = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=${query}`
    );
    const data = await response.json();
    if(!data.items) {
      return [];
    }
    console.log('fetched', data)
    return data.items.map((item) => item.title);
  } catch(error) {
    console.log(`Error fetching data: ${error}`)
    return [];
  }
};
function App() {
  const [suggestion, setSuggestion] = useState([]);
  const [input, setInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isFetching) {
      return;
    }
    fetchSuggestionFromApi(input).then((result) => {
      if (mounted) {
        setSuggestion(result);
        setIsFetching(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [input, isFetching]);

  const onInput = (e) => {
    const query = e.target.value;
    setInput(query);
    setIsFetching(true);
  };

  return (
    <div>
      <input type="text" onInput={debounce(onInput, 500)} />
      <ul>
        {suggestion && suggestion.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}

export default App;
