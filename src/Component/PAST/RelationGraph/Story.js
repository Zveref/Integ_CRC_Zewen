import {useContext, useState} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import { Button, Card, CardHeader, CardContent, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from "react";
import _ from 'lodash';
import "./styles.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import CardActions from '@mui/material/CardActions';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { grey } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


const Div = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <ExpandMoreIcon {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function Story (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  //target: the character of the popover story
  const {target, type, dynamic = false} = props;
  const isMale = _.get(target, "gender", "1") != 0;
  const prefix = _.get(target, ["documented_name"], "Unknown Slave") == 'Unknown' ? "This slave" : _.get(target, ["documented_name"], "Unknown Slave")
  const [expand, setExpand] = new React.useState(false);

  const handleExpandClick = () => {
    setExpand(!expand);
  };

  return (
    <>
    {!dynamic && <Card 
    // sx={{ flexGrow: 1,  width: 400}}
    className="story"
    >
      <CardHeader
        title={`Story of ${_.get(target, ["documented_name"], "Unknown Slave")}`}
      />
      <CardContent>
        <Div>{prefix} was <b>{_.get(target, ["captive_fate", "name"], "not recorded with date")}</b>, transported on voyage <b>{_.get(target, ["voyage", "id"], "* target NA *")}</b></Div>
        <Div>The voyage took {isMale ? "him" : "her"} from <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_port_voyage_begin", "geo_location", "name"], "unknown embarking place") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_region_voyage_begin", "geo_location", "name"], "unknown embarking region") + ")"}</b> to <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "unknown destination") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_principal_region_slave_dis", "geo_location", "name"], "unknown parent regoin") + ") "}</b> in <b>{_.get(target, ["voyage", "voyage_dates", "date_departed_africa_yyyy"], "unkown year")}</b></Div>
	      <Div>The ship, <b>{_.get(target, ["voyage", "voyage_ship", "ship_name"], "which has not verified")}</b>, was owned by <b>{_.get(target, ["voyage", "voyage_captainconnection", 0, "captain", "name"], "unknown captain")}</b></Div>
	      <Div>{isMale ? "He" : "She"} was consigned by CONSIGNOR, and sold by SELLER to BUYER in <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "location_type", "name"], "somewhere named")}:</b> <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], "unknown place")}</b> on TRANSACTION DATE.</Div>
      </CardContent>

    </Card>}

    {dynamic && <Card className="story_func">
      <CardHeader
      // textTransform: 'capitalize'
        titleTypographyProps = {{ pb:0, typography: 'h3.Heading', variant:"", fontStyle: 'italic', fontSize:37, textAlign: 'right'}}
        subheaderTypographyProps = {{ pt:0, variant:"", fontStyle: 'italic', color:"black",  fontSize:20}}
        className="test"
        title = {expand ? "Story" : "Info"}
        subheader ={_.get(target, ["documented_name"], "Unknown Slave")}
        sx={{pb: 1}}
      />
      {/* <hr/> */}
      <CardContent sx={{pt:0}}>
        <List dense = {true} disablePadding={true}>
          <ListItem  disablePadding={true}><ListItemText primary="Slave ID" secondary={_.get(target, "id", "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Mordern Name" secondary={(_.get(target, ["modern_name"], "No Record") == null) || (_.get(target, ["modern_name"], "No Record") == "") ? "No Record" : _.get(target, ["modern_name"], "No Record") }/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Sex" secondary={_.get(target, "gender") == 1 ? "Male" : _.get(target, "gender") == 0 ? "Female" : "No Record"}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Age" secondary={_.get(target, "age", "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Fate" secondary={_.get(target, ["captive_fate", "name"], "No Record")}/></ListItem>
        </List>
        {/* <Grid>Mordern Name: {_.get(target, ["modern_name"], "No Record")}</Grid>
        <Grid>Sex: {_.get(target, "gender") == 1 ? "Male" : _.get(target, "gender") == 0 ? "Female" : "No Record"}</Grid>
        <Grid>Age: {_.get(target, "age", "No Record")}</Grid>
        <Grid>Fate: {_.get(target, ["captive_fate", "name"], "No Record")}</Grid>
        <Grid>Traded Year: NA</Grid> */}
      </CardContent>

      <CardActions disableSpacing>
        <Button aria-label="see personal network" size="large" startIcon={<ManageSearchIcon color="disabled" sx={{ color: grey[800]}} onClick={() => {navigator.clipboard.writeText("Story of " + _.get(target, ["documented_name"], "Unknown Slave"))}} />}>
        </Button>
        <ExpandMore
          expand={expand}
          onClick={handleExpandClick}
          aria-expanded={expand}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <CardContent>
          <Div>{prefix} was <b>{_.get(target, ["captive_fate", "name"], "not recorded with date")}</b>, transported on voyage <b>{_.get(target, ["voyage", "id"], "* target NA *")}</b></Div>
          <Div>The voyage took {isMale ? "him" : "her"} from <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_port_voyage_begin", "geo_location", "name"], "unknown embarking place") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_region_voyage_begin", "geo_location", "name"], "unknown embarking region") + ")"}</b> to <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "unknown destination") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_principal_region_slave_dis", "geo_location", "name"], "unknown parent regoin") + ") "}</b> in <b>{_.get(target, ["voyage", "voyage_dates", "date_departed_africa_yyyy"], "unkown year")}</b></Div>
          <Div>The ship, <b>{_.get(target, ["voyage", "voyage_ship", "ship_name"], "which has not verified")}</b>, was owned by <b>{_.get(target, ["voyage", "voyage_captainconnection", 0, "captain", "name"], "unknown captain")}</b></Div>
          <Div>{isMale ? "He" : "She"} was consigned by CONSIGNOR, and sold by SELLER to BUYER in <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "location_type", "name"], "somewhere named")}:</b> <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], "unknown place")}</b> on TRANSACTION DATE.</Div>
        </CardContent>
      </Collapse>
        
        {/* <Button variant="contained" startIcon={<VisibilityIcon />} size="large" color="grey" onClick={() => window.alert("hi")} sx={{ ml: 3, mt:3, mb:5, mr: 1 }} /> */}
    </Card>}
    </>
  )
}