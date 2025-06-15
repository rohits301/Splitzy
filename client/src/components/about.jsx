import { Typography, Container, Box, Link } from "@mui/material";
import { memo } from "react";

const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.paper', boxShadow: 2, my: 10, py: 10 }}>
      <Box textAlign="center">
        <Link href="/">
          <img
            src="../static/expense-split1-nobg.png"
            alt="Splitzy Logo"
            width="80"
            height="80"
            loading="lazy"
          />
        </Link>
        <Typography variant="h2" align="center" gutterBottom>
          Splitzy
        </Typography>
      </Box>

      <Typography variant="h5" mt={4}>
        Group Expense Management
      </Typography>

      <Typography variant="body1" mt={2}>
        Splitzy is a simple, modern group expense splitting application, inspired by Splitwise. It is built with JavaScript, PostgreSQL, Express, React and Node.js. Whether you're planning a trip, sharing a flat, or managing team expenses, Splitzy helps you track who owes whom—accurately and effortlessly.
      </Typography>

      <Typography variant="h6" id="features" mt={4}>
         Features
      </Typography>
      <Box mt={2} ml={5}>
        <ul>
          <li>Create and join user groups for shared expenses</li>
          <li>Log group expenses with split calculations</li>
          <li>Settle balances with a clear summary of who owes whom</li>
          <li>Visual dashboards with monthly and category-wise analytics</li>
          <li>Secure login and registration with JWT-based authentication</li>
        </ul>
      </Box>

      <Typography variant="h6" id="license" mt={4}>
        License
      </Typography>
      <Typography variant="body2" paragraph>
        This project is licensed under the MIT License.
      </Typography>
      <Typography variant="body2" paragraph>
        &copy; {currentYear} Rohit Sachdeva. All rights reserved.
      </Typography>
      

      <Box textAlign="center" mt={4}>
        <Link href="https://github.com/rohits301/Splitzy/issues">Report a Bug</Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="https://github.com/rohits301/Splitzy/issues">Request a Feature</Link>
      </Box>
    </Container>
  );
};

export default memo(About);