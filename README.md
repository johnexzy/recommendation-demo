# Text Embedding & Similarity Search

This React application provides a user interface for text embedding and similarity search functionalities. It allows users to input text, generate embeddings, and find similar texts based on those embeddings.

## Features

- User authentication (login/logout)
- Text embedding generation
- Similarity search based on embedded text
- Responsive design for various screen sizes

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/johnexzy/recommendation-demo.git
   ```

2. Navigate to the project directory:
   ```
   cd recommendation-demo
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and visit `http://localhost:3000`

3. Log in using your credentials

4. Enter text in the provided textarea

5. Click "Embed Text" to generate an embedding for the input text

6. Click "Find Similar Texts" to search for similar texts based on the input

## API Integration

This application requires a backend API running on `http://localhost:9000`. Ensure that your API provides the following endpoints:

- POST `/login`: For user authentication
- POST `/embed`: For generating text embeddings
- POST `/recommend`: For finding similar texts

Make sure to set up and run your backend server before using this application.

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you have any questions or feedback, please contact:

Your Name - youremail@example.com

Project Link: https://github.com/yourusername/text-embedding-similarity-search
