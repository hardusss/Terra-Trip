import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import Flag from 'react-world-flags';

const setCountry = (data) => {
  window.localStorage.setItem("country", data.label);
};

const Country = () => {
  const [value, setValue] = useState({ label: "Ukraine", value: "UA" });

  const options = useMemo(() => countryList().getData(), []);

  const customSingleValue = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Flag code={data.value} style={{ width: 24, height: 16, marginRight: 10 }} />
      {data.label}
    </div>
  );

  const changeHandler = (selectedOption) => {
    setValue(selectedOption);
    setCountry(selectedOption);
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={changeHandler}
      components={{ SingleValue: customSingleValue }}
      defaultValue={value}
      styles={{
        control: (provided) => ({
          ...provided,
          marginBottom: '15px',
        }),
      }}
    />
  );
};

export default Country;
