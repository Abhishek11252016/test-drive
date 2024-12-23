import React, { useEffect, useState, useRef } from "react";

import ReactSelect from "../ReactSelect/ReactSelect.jsx";
import Calendar from "../Calendar/Calendar.jsx";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import { Grid2 as Grid, Box } from "@mui/material";
// import Grid from '@mui/material/Grid2';
import "./App.css";


function App() {
  const [Entity, setEntity] = useState(null);
  const [EntityId, setEntityId] = useState(null);
  const [CxName, setCxName] = useState("");
  ZOHO.embeddedApp.on("PageLoad", async function (data) {
    console.log(data);
    let module = data.Entity;
    let id = data.EntityId[0];
    ZOHO.CRM.API.getRecord({
      Entity: data.Entity,  RecordID:data.EntityId[0]
     })
     .then(function(data){
      console.error(module);
       console.error(id)
         console.error(data)
        //  console.error(data.data[0].Deal_Name)
         if(module == "Leads"){
         setCxName({"id":id ,"Name":data.data[0].Full_Name})
         }else if(module == "Deals"){
         setCxName({"id":id,"Name":data.data[0].Deal_Name})
         }
     })
    setEntity(data.Entity);
    setEntityId(data.EntityId);
  })
  const [Modal, setModal] = useState();
  const domElem = useRef(100);
  const Modalquery =
    "select ZModels,ZModels.Name from ZProductLifeCycleManager where Eligible_For_Decomission in 'True' GROUP BY ZModels,ZModels.Name";
  const [vehiclequery, setVehicleQuery] = useState("");
  const isFirstMount = useRef(true);
  const [resource, setResource] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Track the selected date for navigation
 const [SlotDuration,setSlotDuration]=useState("00:00:00");
 const [DayStartTime,setDayStartTime]=useState("00:00:00");
 const [DayEndTime,setDayEndTime]=useState("00:00:00");
  useEffect(()=>{
    
    ZOHO.CRM.API.searchRecord({ Entity: "Configuration", Type: "criteria", Query: "(Name1:equals:Test Drive Slot Details)" }).then(function (config) {
      console.log("config " + config);
      if (config.status !== 204) {

        // setSlotDuration(config.data[0].Slot_Duration);
        // setDayStartTime(config.data[0].Day_start_time);
        // setDayEndTime(config.data[0].Day_end_time);
         // Start time at 9 AM
        setSlotDuration("01:30:00");
        setDayStartTime("09:00:00");
        setDayEndTime("19:30:00");

      }
    });
  },[])





  const [PrefillData,setPrefillData] = useState([]);
  const handleDateChange = (e) => {
    if(Modal){
    const newDate = e.target.value;
    setSelectedDate(newDate); // Update the selected date

      let arr=[];
      resource.forEach(element => {
        arr.push(element.id);
      });
      let config = {
        select_query:
          "select Demo_Car_Assigned,Demo_Car_Assigned.Name,Time_In,Time_Out,Lead,Lead.Full_Name,Qualified_Leads,Qualified_Leads.First_Name from ZTestDrives where Demo_Car_Assigned in "+arr+" and Test_Drive_Date='" + newDate+"'"
      };
      console.log(config);
      ZOHO.CRM.API.coql(config).then(function (data) {
        console.log(data);
        setPrefillData(data.data);
        // data.data.forEach(element => {
        //     console.timeLog(element);
        // });
      });
   

    if (newDate) {
      // Trigger calendar navigation to the selected date
      // You will need to pass the selected date to the Calendar component
    }
  }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return; // Skip the effect during the first render
    }
    if (Modal) {
      console.log(Modal);
      setVehicleQuery(
        "select Name from ZProductLifeCycleManager where Eligible_For_Decomission in 'True' and ZModels=" +
          Modal.ZModels.id
      );
    } else {
      setVehicleQuery("");
      setResource([]);
    }
  }, [Modal]);

  useEffect(() => {
    console.log(Modal);
    if (Modal ) {
      console.log(vehiclequery);
      let config = {
        select_query:
          "select Name from ZProductLifeCycleManager where Eligible_For_Decomission in 'True' and ZModels=" +
          Modal.ZModels.id +
          "",
      };
      console.log(config);
      ZOHO.CRM.API.coql(config).then(function (data) {
        console.log(data);
        setResource(data.data);
      });
    } else {
      //   console.log("RE");
      // setResource([]);
    }
  }, [vehiclequery]);
  const [value, setValue] = React.useState(null);

  const today = new Date().toISOString().split('T')[0];
  console.log(today)
  return (
    <>
    <div style={{
      margin:"10px",
    }}>
<b-container class="bv-example-row">
  <b-row>
    <b-col><ReactSelect
              Query={Modalquery}
              SearchType={"COQL"}
              ValueName={"ZModels.Name"}
              label={"Select Modal"}
              setSelectedValue={setModal}
            /></b-col>
    <b-col><label>Select Date</label>{" "}
            <Form.Control
              type="date"
              value={selectedDate || ""}
              onChange={handleDateChange}
              min={today}
            /></b-col>
            
   
  </b-row>
</b-container>
</div>

      <Calendar resources={resource} setPrefillData={setPrefillData} PrefillData={PrefillData} CxName={CxName} Entity={Entity} EntityId={EntityId} selectedDate={selectedDate} SlotDuration={SlotDuration} DayStartTime={DayStartTime} DayEndTime={DayEndTime} /> 
    </>
  );
}
export default App;




 