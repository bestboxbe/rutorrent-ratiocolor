# ruTorrent Ratiocolor Plugin

A ruTorrent plugin that dynamically colors the ratio column based on torrent ratio values, providing instant visual feedback on seeding performance.

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Overview

The **Ratiocolor** plugin enhances the ruTorrent interface by applying gradient colors to the ratio column, making it easy to identify torrents with low, medium, or high ratios at a glance. The plugin supports customizable color schemes, ratio thresholds, and display modes.

Originally developed by **Gyran**, this enhanced version has been further developed by **BestBox** with additional features including:
- Dynamic level management (add/remove ratio thresholds)
- Customizable color gradients
- Multiple coloring modes (background or font)
- Automatic contrast adjustment for readability
- Persistent settings storage
- Multi-language support (21 languages)

## ✨ Features

### Core Functionality
- **Dynamic Color Gradients**: Smooth color transitions between ratio thresholds
- **Customizable Levels**: Define your own ratio breakpoints
- **Multiple Color Modes**: 
  - Background coloring with automatic text contrast
  - Font coloring
- **Visual Level Editor**: Interactive gradient bar showing all configured levels
- **Add/Remove Levels**: Easily manage ratio thresholds through the UI
- **Persistent Settings**: All configurations are saved and restored automatically

### Visual Feedback
- **Gradient Visualization**: See your color scheme in a visual gradient bar
- **Real-time Updates**: Colors update automatically as ratios change
- **Contrast Mode**: Automatically adjusts text color for optimal readability

### Internationalization
Supports 21 languages out of the box:
- Czech (cs), Danish (da), German (de), English (en), Spanish (es)
- Finnish (fi), French (fr), Hungarian (hu), Italian (it), Latvian (lv)
- Dutch (nl), Polish (pl), Portuguese (pt), Russian (ru), Slovak (sk)
- Serbian (sr), Turkish (tr), Ukrainian (uk), Vietnamese (vi)
- Chinese Simplified (zh-cn), Chinese Traditional (zh-tw)

## 🚀 Installation

### Prerequisites
- ruTorrent web interface installed
- PHP with JSON extension enabled
- rTorrent backend

### Installation Steps

1. **Navigate to the ruTorrent plugins directory:**
   ```bash
   cd /path/to/rutorrent/plugins/
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/bestboxbe/rutorrent-ratiocolor.git ratiocolor
   ```

3. **Set proper permissions:**
   ```bash
   chmod -R 755 ratiocolor
   chown -R www-data:www-data ratiocolor  # Adjust user/group as needed
   ```

4. **Restart your web server** (if necessary):
   ```bash
   # For Apache
   sudo systemctl restart apache2
   
   # For Nginx with PHP-FPM
   sudo systemctl restart php-fpm
   sudo systemctl restart nginx
   ```

5. **Refresh ruTorrent** in your browser

The plugin should now be active and visible in the Settings panel.

## ⚙️ Configuration

### Default Settings

The plugin comes with sensible defaults defined in `conf.php`:

```php
$ratioColorSettings = array(
    "levels" => array(0, 1, 3, 30),
    "colors" => array(
        array(255, 0, 0),      // Red (ratio 0-1)
        array(255, 155, 50),   // Orange (ratio 1-3)
        array(0, 220, 0),      // Green (ratio 3-30)
        array(0, 155, 255)     // Blue (ratio 30+)
    ),
    "changeWhat" => "cell-background",
    "contrast" => true
);
```

### Customizing Settings

#### Via ruTorrent UI (Recommended)

1. Open ruTorrent
2. Go to **Settings** → **Ratio Color**
3. Configure the following options:

   **Coloring Mode:**
   - Background color (with optional contrast text)
   - Font color

   **Contrast Text:**
   - Enable/disable automatic text color adjustment for readability

   **Level Management:**
   - View current ratio levels in the gradient bar
   - Add new levels by entering a ratio value and selecting a color
   - Delete levels by clicking the × button (minimum 2 levels required)

#### Via Configuration File

Edit `conf.php` to set default values:

```php
$ratioColorSettings = array(
    "levels" => array(0, 1, 2, 5, 10, 20, 50),  // Ratio thresholds
    "colors" => array(
        array(255, 0, 0),      // Red
        array(255, 100, 0),    // Orange-Red
        array(255, 200, 0),    // Orange
        array(200, 255, 0),    // Yellow-Green
        array(0, 255, 0),      // Green
        array(0, 200, 255),    // Cyan
        array(0, 100, 255)     // Blue
    ),
    "changeWhat" => "cell-background",  // or "font"
    "contrast" => true                   // or false
);
```

**Important Notes:**
- The number of levels must match the number of colors
- The first level must always be `0`
- Levels should be in ascending order
- Colors are defined as RGB arrays `[R, G, B]` with values 0-255

## 🎨 How It Works

### Color Calculation

The plugin uses linear interpolation to calculate colors between defined thresholds:

1. **Ratio Detection**: Reads the ratio value from each torrent
2. **Threshold Matching**: Finds the appropriate level range
3. **Color Interpolation**: Calculates the exact color using gradient interpolation
4. **Application**: Applies the color to the cell background or font

### Example

With default settings:
- Ratio **0.5** → Red-Orange gradient (between 0 and 1)
- Ratio **2.0** → Orange-Green gradient (between 1 and 3)
- Ratio **15.0** → Green-Blue gradient (between 3 and 30)
- Ratio **100.0** → Pure Blue (above 30)

### Contrast Mode

When enabled, the plugin automatically calculates optimal text color (black or white) based on the background color's luminance using the formula:

```
gamma = R×0.299 + G×0.587 + B×0.114
```

This ensures text remains readable regardless of background color.

## 📁 File Structure

```
ratiocolor/
├── action.php          # Handles AJAX requests for saving settings
├── conf.php            # Default configuration
├── init.js             # Main JavaScript logic
├── init.php            # PHP initialization
├── plugin.info         # Plugin metadata
├── ratiocolor.css      # Styling for settings UI
├── settings.php        # Settings management class
├── lang/               # Language files
│   ├── en.js          # English
│   ├── hu.js          # Hungarian
│   ├── de.js          # German
│   └── ...            # 18 more languages
└── README.md          # This file
```

## 🔧 Technical Details

### PHP Components

**`rRatioColorSettings` Class** (`settings.php`):
- `get()`: Returns settings as JavaScript object
- `set()`: Saves settings from POST request
- `store()`: Persists settings to cache
- `obtain()`: Loads settings from cache

### JavaScript Components

**Core Functions:**
- `colorSub()`, `colorAdd()`, `colorMul()`: Color math operations
- `colorRGB()`: Converts RGB array to CSS string
- `colorContrast()`: Calculates optimal text color
- `hexToRgb()`, `rgbToHex()`: Color format conversion

**Main Methods:**
- `theWebUI.setRatioColors()`: Applies colors to all ratio cells
- `theWebUI.ratiocolorLevelsbar()`: Generates visual gradient bar
- `theWebUI.updateRatiocolorsLevelsBar()`: Updates gradient bar
- `plugin.saveSettings()`: Saves settings via AJAX

### Settings Storage

Settings are stored in ruTorrent's cache system with the hash `ratiocolor.dat`. This ensures:
- Persistence across sessions
- Per-user configuration support
- Automatic loading on plugin initialization

## 🌍 Localization

### Adding a New Language

1. Create a new file in `lang/` directory (e.g., `lang/xx.js`)
2. Copy the structure from `lang/en.js`
3. Translate all strings:

```javascript
theUILang.ratiocolorName = "Ratiocolor";
theUILang.ratiocolorLengthError = "Your translation here";
theUILang.ratiocolorLevel0 = "Your translation here";
theUILang.ratiocolorLegend = "Your translation here";
theUILang.ratiocolorSettings = "Your translation here";
theUILang.ratiocolorMode = "Your translation here";
theUILang.ratiocolorBackground = "Your translation here";
theUILang.ratiocolorFont = "Your translation here";
theUILang.ratiocolorContrast = "Your translation here";
theUILang.ratiocolorLevel = "Your translation here";
theUILang.ratiocolorColor = "Your translation here";
theUILang.ratiocolorAddLevel = "Your translation here";
theUILang.ratiocolorDeleteLevel = "Your translation here";

thePlugins.get("ratiocolor").langLoaded();
```

## 🐛 Troubleshooting

### Plugin Not Loading

**Check PHP JSON extension:**
```bash
php -m | grep json
```

**Check file permissions:**
```bash
ls -la /path/to/rutorrent/plugins/ratiocolor/
```

**Check web server error logs:**
```bash
# Apache
tail -f /var/log/apache2/error.log

# Nginx
tail -f /var/log/nginx/error.log
```

### Colors Not Applying

1. **Clear browser cache** and hard refresh (Ctrl+F5 / Cmd+Shift+R)
2. **Check browser console** for JavaScript errors (F12)
3. **Verify settings** in Settings → Ratio Color
4. **Check that ratio column is visible** in ruTorrent

### Settings Not Saving

1. **Check cache directory permissions:**
   ```bash
   ls -la /path/to/rutorrent/share/
   ```

2. **Verify PHP has write access** to cache directory

3. **Check browser console** for AJAX errors

### Remote rTorrent Error

If you see "rtorrent.remote: error" in `plugin.info`, this is expected. The plugin works with both local and remote rTorrent installations, but the warning indicates it requires a working rTorrent connection.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Test with multiple browsers (Chrome, Firefox, Safari)
- Ensure backward compatibility
- Update documentation for new features
- Add translations for new UI strings

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 BestBox, Gyran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Authors

- **Gyran** - Original developer
- **BestBox** - Enhanced version with additional features

## 🔗 Links

- **GitHub Repository**: [https://github.com/bestboxbe/rutorrent-ratiocolor](https://github.com/bestboxbe)
- **ruTorrent**: [https://github.com/Novik/ruTorrent](https://github.com/Novik/ruTorrent)
- **rTorrent**: [https://github.com/rakshasa/rtorrent](https://github.com/rakshasa/rtorrent)

## 📊 Changelog

### Version 1.0
- ✨ Dynamic level management (add/remove thresholds)
- 🎨 Visual gradient bar editor
- 🌈 Customizable color schemes
- 🔄 Real-time color updates
- 💾 Persistent settings storage
- 🌍 Multi-language support (21 languages)
- ⚡ Performance optimizations
- 🎯 Improved contrast calculation
- 🐛 Bug fixes and stability improvements

## 💡 Tips & Best Practices

### Recommended Color Schemes

**Traffic Light (Simple):**
```php
"levels" => array(0, 1, 2),
"colors" => array(
    array(255, 0, 0),    // Red (poor)
    array(255, 255, 0),  // Yellow (good)
    array(0, 255, 0)     // Green (excellent)
)
```

**Rainbow (Detailed):**
```php
"levels" => array(0, 0.5, 1, 2, 5, 10, 20),
"colors" => array(
    array(139, 0, 0),    // Dark Red
    array(255, 0, 0),    // Red
    array(255, 165, 0),  // Orange
    array(255, 255, 0),  // Yellow
    array(173, 255, 47), // Yellow-Green
    array(0, 255, 0),    // Green
    array(0, 191, 255)   // Deep Sky Blue
)
```

**Monochrome (Subtle):**
```php
"levels" => array(0, 1, 3, 10),
"colors" => array(
    array(100, 100, 100), // Dark Gray
    array(150, 150, 150), // Gray
    array(200, 200, 200), // Light Gray
    array(255, 255, 255)  // White
)
```

### Performance Tips

- Keep the number of levels reasonable (5-10 is optimal)
- Use contrast mode for better readability
- Avoid too many similar colors in sequence
- Test your color scheme with actual torrent data

## ❓ FAQ

**Q: Can I use this with other ruTorrent themes?**  
A: Yes, the plugin is theme-agnostic and works with all ruTorrent themes.

**Q: Does this affect ruTorrent performance?**  
A: No, the plugin is lightweight and only updates colors when the torrent list refreshes.

**Q: Can I have different settings for different users?**  
A: Yes, settings are stored per-user in ruTorrent's cache system.

**Q: What happens if I set invalid levels?**  
A: The plugin validates settings and will show error messages in the browser console if levels are invalid.

**Q: Can I export/import my color scheme?**  
A: Currently, you need to manually copy the settings from `conf.php` or the cache file. A future version may include export/import functionality.

---

**Made with ❤️ for the ruTorrent community**
