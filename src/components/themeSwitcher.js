import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check the current theme in localStorage
    const theme = localStorage.getItem('theme');
	setTheme( theme );
    if (theme === 'theme_dark') {
      setIsDarkMode(true);
    } else {
		setIsDarkMode(false);
	}
  }, []); // Empty dependency array to run this code once

  const toggleTheme = () => {
    if (isDarkMode) {
      setTheme('theme_light');
    } else {
      setTheme('theme_dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (themeName = 'theme_dark') => {
	if (!themeName) themeName = 'theme_dark';
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  };

  return (
    <div className="form-check form-switch themeSwitcher d-flex align-items-center p-2">
      <label htmlFor="themeSwitcher" className="form-check-label" style={{ marginRight: '0px', fontSize:'16px' }}>{t('Dark')}</label>
      <input
        className="form-check-input"
        type="checkbox"
        id="themeSwitcher"
        onChange={toggleTheme}
        style={{ marginLeft: '6px' }}
        checked={isDarkMode}
      />
      <label htmlFor="themeSwitcher" className="form-check-label mx-1" style={{ marginRight: '0px', fontSize:'16px' }}>{t('Light')}</label>
    </div>
  );
}

export default ThemeSwitcher;
