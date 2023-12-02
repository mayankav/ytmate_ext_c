import React, { useState } from "react";
import "./index.scss";
import Button from "../ui-components/button";

interface SearchBoxProps {
  toggleSearchBox: () => void;
  onSearchTextChange: (searchText: string) => void;
}

const SearchBox = ({ toggleSearchBox, onSearchTextChange }: SearchBoxProps) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    onSearchTextChange(value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search with keywords"
        className="searchbox"
        value={searchText}
        onChange={handleSearch}
      />
      <Button onClick={toggleSearchBox}>Cancel</Button>
    </>
  );
};

export default SearchBox;
