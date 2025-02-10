import express from 'express';
import path from 'node:path';
import { ApolloServer, gql } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// JWT authentication function
const authenticateGraphQL = (req: express.Request) => {
  const token = req.headers.authorization || '';

  if (!token) return { user: null };

  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token.split(' ')[1], secretKey) as { _id: string, username: string, email: string };

    return { user: decoded }; // Return user data extracted from the token
  } catch (err) {
    return { user: null }; // Invalid token, no user
  }
};

// Define GraphQL typeDefs (schema) and resolvers
const typeDefs = gql`
  type Book {
    bookId: String!
    authors: [String!]!
    description: String
    title: String!
    image: String
    link: String
  }

  type User {
    _id: String!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book!]
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, authors: [String!]!, description: String, title: String!, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      return { _id: user._id, username: user.username, email: user.email, bookCount: 0, savedBooks: [] };
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const token = 'generated-jwt-token';
      const user = { _id: 'user-id', username: 'user', email };
      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const token = 'generated-jwt-token';
      const user = { _id: 'new-user-id', username, email };
      return { token, user };
    },
    saveBook: async (_, { bookId, authors, description, title, image, link }, { user }) => {
      if (!user) throw new Error('Authentication required');
      return { _id: user._id, username: user.username, email: user.email, bookCount: 1, savedBooks: [] };
    },
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      return { _id: user._id, username: user.username, email: user.email, bookCount: 0, savedBooks: [] };
    },
  },
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { user } = authenticateGraphQL(req); // Get user info from token using authenticateGraphQL function
    return { user }; // Pass the user info into the GraphQL context
  },
});

// Apply Apollo Server middleware to the Express app
server.applyMiddleware({ app });

// Add the REST API routes
app.use(routes);

// Connect to the database and start the server
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
