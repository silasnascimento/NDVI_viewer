

# README: NDVI Monitoring WebGIS

## Overview
This project is a WebGIS application for monitoring Normalized Difference Vegetation Index (NDVI) values within a user-defined region. The application uses Leaflet for the frontend and a Flask backend to integrate with the Google Earth Engine (GEE). It allows users to draw polygons on a map, specify a date range, and retrieve NDVI statistics (mean, min, max) and visualization tiles.

## Features
- **Interactive Map Interface**: Users can draw polygons to define areas of interest.
- **Dynamic NDVI Retrieval**: Calculate and visualize NDVI values for a specified date range.
- **Cloud-Based Data Processing**: NDVI calculations are performed using Sentinel-2 imagery from the GEE.
- **Customizable Parameters**: Filter by date range and cloud cover percentage.
- **Visualization Layer**: Overlay NDVI visualization tiles on the map.

## Installation

### Prerequisites
- Python 3.7+
- Node.js and npm (for any additional frontend dependencies)
- Access to Google Earth Engine API
- Flask and required Python packages
- Leaflet.js and Leaflet Draw

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ndvi-webgis.git
   cd ndvi-webgis
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Google Earth Engine API:
   - Ensure you have GEE credentials.
   - Authenticate using `earthengine authenticate`.

4. Start the Flask backend:
   ```bash
   python app.py
   ```

5. Open `webgis_amb.html` in a browser to start the frontend.

## Usage
1. Draw a polygon on the map to define the region of interest.
2. Select a start and end date using the date picker.
3. Click **Update Data** to fetch NDVI statistics and visualization.
4. View NDVI metrics and overlay NDVI tiles on the map.

## Endpoints
### `/calculate_ndvi` (POST)
Calculates NDVI statistics for a specified region and date range.
- **Input**: GeoJSON region, start_date, end_date
- **Output**: NDVI mean, min, and max

### `/get_ndvi_tiles` (POST)
Generates a URL for NDVI visualization tiles.
- **Input**: GeoJSON region, start_date, end_date
- **Output**: Tile URL for Leaflet integration

## File Structure
```
project/
│
├── app.py                # Flask backend
├── script.js             # Leaflet frontend logic
├── index.html            # Main WebGIS HTML page
├── styles.css            # Custom styles
├── requirements.txt      # Python dependencies
```

## Technical Details
- **Backend**: Flask handles API requests and integrates with GEE for NDVI processing.
- **Frontend**: Leaflet with Leaflet Draw plugin for interactive map and drawing tools.
- **Data Source**: Sentinel-2 imagery via Google Earth Engine.
- **Visualization**: NDVI visualization is generated as tiles, styled using a color palette.

## Future Improvements
- Add support for exporting results as GeoJSON or CSV.
- Integrate additional vegetation indices (e.g., EVI, NDRE).
- Implement authentication for secure access.
- Optimize performance for larger datasets and regions.

## License
This project is open-source and available under the MIT License. See the LICENSE file for more details.
