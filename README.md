// ========== README.md ==========
# Shopee Link Manager

A modern web application for managing and distributing Shopee product links with AI-powered commission detection.

## Features

- **CSV Upload & Filtering**: Upload multiple CSV files and automatically filter based on trends and ad status
- **AI Commission Detection**: Use Google Gemini AI to analyze screenshots and extract commission rates
- **Batch Distribution**: Organize links into batches and distribute via WhatsApp
- **Phone Management**: Manage multiple WhatsApp numbers for distribution
- **Modern UI**: Glassmorphism design with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: MySQL
- **AI**: Google Gemini API
- **State Management**: React Hooks
- **File Processing**: PapaParse for CSV

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shopee-link-manager.git
cd shopee-link-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
```bash
mysql -u root -p < init-db.sql
```

4. Configure environment variables:
Create a `.env.local` file and add:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopee_link_manager
GEMINI_API_KEY=your_gemini_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload CSV**: Start by uploading CSV files in the Upload CSV tab
2. **Set Rank**: Define how many top products to include from each file
3. **Process**: Click PROSES to filter and shuffle the data
4. **Add Commissions**: Switch to Komreg tab to upload screenshots and detect commissions
5. **Set Threshold**: In Distribusi tab, set the maximum number of links to process
6. **Distribute**: Select phone numbers and send batches via WhatsApp

## Database Schema

The application uses 4 main tables:
- `phones`: Stores WhatsApp contact information
- `filtered_links`: Stores processed product links with commissions
- `batch_info`: Manages threshold and batch settings
- `distribution_logs`: Tracks distribution history

## Contributing

Feel free to submit issues and enhancement requests!