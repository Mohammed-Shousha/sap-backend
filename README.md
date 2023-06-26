# SAP Backend

An Apollo GraphQL server that serves as the backend for the SAP Mobile App.

## Features

- **User Management**: Provides user registration and authentication functionality. Users can register as regular users or doctors by providing their name, email, and password. Doctors are identified by a license number. The server supports user login and retrieval of user information.

- **Medicine Management**: Allows users to retrieve information about medicines, including their name, availability, price, description, and position. Admins can update the available quantity of existing medicines.

- **Prescription Management**: Enables the creation and retrieval of prescriptions. Users can create prescriptions by specifying the patient ID, doctor ID, and a list of prescribed medicines with their respective quantities and instructions. Prescriptions include details such as patient and doctor information, prescribed medicines, date, payment status, and receipt status.

- **Payment Processing**: The server integrates with Stripe, a popular payment processing platform, to handle payment transactions. Users can make payments for their prescriptions through the server using Stripe's secure payment gateway.

## Used Technologies

- **Apollo Server**: The server is built using the Apollo Server library, which provides a GraphQL implementation for Node.js. It handles incoming GraphQL requests and executes the defined resolvers to fetch or mutate data.

- **GraphQL**: The server implements the GraphQL specification for defining the API schema, types, queries, mutations, and subscriptions. GraphQL allows clients to query and manipulate data efficiently and precisely.

- **MongoDB**: The server integrates with a MongoDB database to persist and retrieve data. The medicines, users, and prescriptions data are stored in MongoDB collections.

- **Node.js**: The server is built using Node.js, a JavaScript runtime environment. Node.js enables server-side JavaScript execution and provides a vast ecosystem of libraries and tools for building web applications.

- **Express**: The server utilizes the Express framework, a popular web application framework for Node.js, to handle HTTP requests, routing, and middleware functionality.

- **Stripe**: The server integrates with Stripe to handle payment processing. Stripe provides a secure payment gateway that allows users to make payments for their prescriptions using various payment methods.
