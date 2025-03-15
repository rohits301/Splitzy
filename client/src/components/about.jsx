// import { Typography } from "@mui/material"
// import { Container } from "@mui/system"
// import Copyright from "./Copyright"

// const About = () => {
//   const currentYear = new Date().getFullYear();
//   return (
//     <>
// <Container maxWidth='md' sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 2,
//             my: 10,
//             py:10
//         }}>
// <div align="center">
//   <a href="/">
//     <img src="https://github.com/rohits301/Splitzy/blob/master/client/public/static/logo.png?raw=true" alt="Logo" width="80" height="80"/>
//   </a>

//   <h2 align="center">Splitzy</h2>

//   <p align="center">
//     Build with the MERN stack (MongoDB, Express, React and NodeJS).
//     <br />
//     <br/>
//     <Copyright/>
//     <br/>
//     <a href="https://github.com/rohits301/Splitzy/issues">Report Bug</a>
//     &nbsp;&nbsp;&nbsp;
//     <a href="https://github.com/rohits301/Splitzy/issues">Request Feature</a>
//   </p>
// </div>
// <br/>
// <center><img src="https://raw.githubusercontent.com/rohits301/Splitzy/master/Screenshots/dashboard-main-transparent.png" alt="splitzy" width={'80%'}/></center>
// <Typography variant="h5">
// MERN Stack Group Expense Splitting Application
// </Typography>
// <br/>
// <ul style={{marginLeft: '40px'}}>
// <li><a href="#introduction">Introduction</a></li>
// <li><a href="#key-features">Key Features</a></li>
// <li><a href="#license">License</a></li>
// </ul>
// <br/>
// <h2 id="introduction">Introduction</h2>
// <br/>
// <p>This is a side project I&#39;ve been working on. A full stack expense spliting app - splitwise clone made using the MERN stack (MongoDB, Express, React &amp; Nodejs), specially designed to split group expense between friends, but can be used for almost any type of business need. With this application, you can add your expense details and get an whole expense analytics feature - Group Balance, Monthly amount spend, Catagory wise expense spending graph etc... Jump right off the <a href="#">Live App</a> and start adding your expenses or download the entire <a href="https://github.com/rohits301/Splitzy/">Source code</a> and run it on your server. This project is something I&#39;ve been working on in my free time so I cannot be sure that everything will work out correctly. But I&#39;ll appreciate you if can report any issue.</p>
// <br/>
// <center><img src="https://raw.githubusercontent.com/rohits301/Splitzy/master/Screenshots/combined-screenshot.png" alt="Features" width={'80%'}/></center>
// <br/>
// <h2 id="key-features">Key Features</h2>
// <br/>
// <ul style={{marginLeft: '40px'}}>
// <li>Create user groups and track group expense </li>
// <li>Keep track of shared expenses and settle your corresponding balances in a convenient and personalized way. </li>
// <li>Get Analytical graphs to understand your expenditure trend </li>
// <li>Multiple user registration.</li>
// <li>Authentication using JSON web token (JWT) </li>
// </ul>
// <br/>
// <h2 id="license">License</h2>
// <br/>
// <p>This project is MIT licensed.</p>
// <br/>
// <p>Copyright {currentYear} Rohit Sachdeva</p>
// <br/>
// <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
// <br/>
// <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
// <br/>
// <p>THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
// <br/>
// <Copyright/>
// <br/>
// </Container>
//  </>
//   )
// }

// export default About

import { Typography, Container, Box, Link } from "@mui/material";
import Copyright from "./Copyright";
import { memo } from "react";

const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.paper', boxShadow: 2, my: 10, py: 10 }}>
      <Box textAlign="center">
        <Link href="/">
          <img
            src="https://github.com/rohits301/Splitzy/blob/master/client/public/static/expense-split1-nobg.png?raw=true"
            alt="Logo"
            width="80"
            height="80"
            loading="lazy"
          />
        </Link>
        <Typography variant="h2" align="center" gutterBottom>
          Splitzy
        </Typography>
        <Typography align="center" paragraph>
          Built with the MERN stack (MongoDB, Express, React, and NodeJS).
        </Typography>
        <Copyright />
        <Box mt={2}>
          <Link href="https://github.com/rohits301/Splitzy/issues">Report Bug</Link>
          &nbsp;&nbsp;&nbsp;
          <Link href="https://github.com/rohits301/Splitzy/issues">Request Feature</Link>
        </Box>
      </Box>
      <Box textAlign="center" mt={4}>
        <img
          src="https://raw.githubusercontent.com/rohits301/Splitzy/master/Screenshots/dashboard-main-transparent.png"
          alt="splitzy"
          width="80%"
          loading="lazy"
        />
      </Box>
      <Typography variant="h5" mt={4}>
        MERN Stack Group Expense Splitting Application
      </Typography>
      <Box mt={2} ml={5}>
        <ul>
          <li><Link href="#introduction">Introduction</Link></li>
          <li><Link href="#key-features">Key Features</Link></li>
          <li><Link href="#license">License</Link></li>
        </ul>
      </Box>
      <Typography variant="h2" id="introduction" mt={4}>
        Introduction
      </Typography>
      <Typography paragraph>
        This is a side project I've been working on. A full stack expense splitting app - splitwise clone made using the MERN stack (MongoDB, Express, React & Nodejs), specially designed to split group expense between friends, but can be used for almost any type of business need. With this application, you can add your expense details and get an whole expense analytics feature - Group Balance, Monthly amount spend, Category wise expense spending graph etc... Jump right off the <Link href="#">Live App</Link> and start adding your expenses or download the entire <Link href="https://github.com/rohits301/Splitzy/">Source code</Link> and run it on your server. This project is something I've been working on in my free time so I cannot be sure that everything will work out correctly. But I'll appreciate you if can report any issue.
      </Typography>
      <Box textAlign="center" mt={4}>
        <img
          src="https://raw.githubusercontent.com/rohits301/Splitzy/master/Screenshots/combined-screenshot.png"
          alt="Features"
          width="80%"
          loading="lazy"
        />
      </Box>
      <Typography variant="h2" id="key-features" mt={4}>
        Key Features
      </Typography>
      <Box mt={2} ml={5}>
        <ul>
          <li>Create user groups and track group expense</li>
          <li>Keep track of shared expenses and settle your corresponding balances in a convenient and personalized way.</li>
          <li>Get Analytical graphs to understand your expenditure trend</li>
          <li>Multiple user registration.</li>
          <li>Authentication using JSON web token (JWT)</li>
        </ul>
      </Box>
      <Typography variant="h2" id="license" mt={4}>
        License
      </Typography>
      <Typography paragraph>
        This project is MIT licensed.
      </Typography>
      <Typography paragraph>
        Copyright {currentYear} Rohit Sachdeva
      </Typography>
      <Typography paragraph>
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      </Typography>
      <Typography paragraph>
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      </Typography>
      <Typography paragraph>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </Typography>
      <Copyright />
    </Container>
  );
};

export default memo(About);