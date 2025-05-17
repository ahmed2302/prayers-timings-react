import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import PropTypes from "prop-types";
export default function Prayers({ name, img, time }) {
  return (
    <Card style={{ minWidth: "260px" }}>
      <CardActionArea>
        <CardMedia component="img" height="200" image={img} alt="img" />
        <CardContent>
          <Typography variant="h2">{name}</Typography>
          <Typography variant="h1" color="text.secondary">
            {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

Prayers.propTypes = {
  name: PropTypes.string,
  img: PropTypes.string,
  time: PropTypes.string,
};
