import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";

const fetchSuggestionFromApi = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=${query}`
    );
    const data = await response.json();
    return data.items.map((item) => item.title);
  } catch(error) {
    console.log(`Error fetching data: ${error}`)
    return [];
  }
};

function App() {
  const [suggestion, setSuggestion] = useState([]);
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchSuggestionFromApi(query);
      setSuggestion(result);
    };
    fetchData();
  }, [query]);

  const onInput = (e) => {
    setQuery(e?.target?.value);
  };

  return (
    <div>
      <input type="text" onInput={debounce(onInput, 500)} />
      <ul>
        {suggestion.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
