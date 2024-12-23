import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function ReactSelect({ Query, SearchType, ValueName, label, setSelectedValue }) {
  const [PicklistOptions, setPicklistOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Fetching options (this assumes options come from Zoho CRM API)
  useEffect(() => {
    if (SearchType === "COQL") {
      let config = {
        select_query: Query,
      };
      ZOHO.CRM.API.coql(config).then(function (data) {
        const options = data.data.map((element) => {
          if (element.ZModels != null) {
            element.ValueName = element[ValueName];
          }
          return element;
        });
        setPicklistOptions(options); // Set initial options
      });
    }
  }, [Query, SearchType]); // Rerun when `Query` or `SearchType` changes

  // Handle selecting an option
  const handleSelectChange = (obj) => {
    if (obj) {
      // Remove the selected option from available options
      setPicklistOptions((prevOptions) =>
        prevOptions.filter((option) => option.id !== obj.id)
      );
    } else {
      // If the option is cleared, re-add it back to the options list
      if (selectedOption) {
        setPicklistOptions((prevOptions) => [...prevOptions, selectedOption]);
      }
    }

    setSelectedOption(obj); // Set the selected value
    setSelectedValue(obj); // Notify parent about the change
  };

  // Handle the search functionality if needed
  const handleSearch = (term) => {
    // Optionally implement search filter logic here
    console.log(term);
  };

  return (
    <>
      <label>{label}</label>
      <Select
        options={PicklistOptions}
        value={selectedOption}
        onChange={handleSelectChange}
        onInputChange={handleSearch}
        isClearable={true} // Allow clearing the selected value
        getOptionLabel={(option) => option.ValueName} // Display the ValueName as label
        getOptionValue={(option) => option.id} // Use `id` as value
      />
    </>
  );
}
