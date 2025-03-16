import { Link, Typography, Box } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <Box textAlign="center" mt={2} sx={{ color: 'text.secondary' }}>
      <Typography variant="body2">
        &copy; {currentYear} rohits301
        <FavoriteIcon color="error" sx={{ fontSize: 18, verticalAlign: 'middle', ml: 0.5 }} />
      </Typography>
      <Link variant="subtitle2" component="a" href="https://github.com/rohits301/Splitzy/" target="_blank">
        [GitHub]
      </Link>
    </Box>
  );
}
