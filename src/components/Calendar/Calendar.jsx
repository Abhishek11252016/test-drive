import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction"; // For event interactions (dragging, clicking)
import ReactModal from "../Modal/Modal.jsx";

import "./Calendar.css";
const Swal = require("sweetalert2");
function Calendar({
  resources,
  selectedDate,
  DayStartTime,
  DayEndTime,
  SlotDuration,
  Entity,
  EntityId,
  CxName,
  PrefillData,
  setPrefillData
}) {
  // const [events, setEvents] = useState([]);

  // Ref to store the calendar API instance
  const calendarRef = useRef(null);
  const [RescheduleFlag,setRescheduleFlag]=useState(false);
  const [RescheduleEvent,setRescheduleEvent]=useState(false);
  useEffect(() => {
    setEvents([]);
    if (PrefillData) {
      PrefillData.forEach((element) => {
        console.log(element);
        let dummytitle;
        let cust;
        if (element.Lead) {
          dummytitle = element["Lead.Full_Name"];
          cust={"Name":element["Lead.Full_Name"],"id":element.Lead};
        } else if (element.Qualified_Leads) {
          dummytitle = element["Qualified_Leads.First_Name"];
          cust={"Name":element["Qualified_Leads.First_Name"],"id":element.Qualified_Leads};
        }
        console.log("dummytitle +" + dummytitle);
        const testDriveId = element.id;
        const title = dummytitle;
        const custlist = cust;
        const resourceId = element.Demo_Car_Assigned.id; // Capture the resourceId from the clicked slot
        const resourceDet = {
          _resource: { title: element["Demo_Car_Assigned.Name"],"id":element.Demo_Car_Assigned.id },
        };
        const dateDetail = {
          date: element.Time_In.split("T")[0],
          time: element.Time_In.split("T")[1].split("+")[0],
        };
        const start = new Date(element.Time_In);
        // const end = element.Time_Out;
        // // const overlap = doesOverlap(start, end, resourceId);

        if (title) {
          const segment1 = {
            id: `${Date.now()}-segment1`, // Unique ID for segment 1
            title,
            custlist,
            testDriveId,
            resourceDet,
            start: start.toISOString(),
            end: new Date(start.getTime() + 60 * 60 * 1000).toISOString(), // First 60 min
            resourceId,
            dateDetail,
            color: "#a4e1ff", // Set color to blue for the first 60 minutes
          };

          const segment2 = {
            id: `${Date.now()}-segment2`, // Unique ID for segment 2
            resourceDet,
            custlist,
            testDriveId,
            start: new Date(start.getTime() + 60 * 60 * 1000).toISOString(), // Start after 60 minutes
            end: new Date(start.getTime() + 90 * 60 * 1000).toISOString(), // End after 90 minutes
            resourceId,
            dateDetail,
            color: "#f9d277", // Set color to green for the next 30 minutes
          };

          // Add both segments to the events state
          setEvents((prevEvents) => [...prevEvents, segment1, segment2]);
        }
      });
    }
  }, [PrefillData]);
  useEffect(() => {
    console.log(calendarRef.current);
    if (calendarRef.current && selectedDate) {
      // Navigate to the selected date when it changes
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate); // Go to the selected date
    }
  }, [selectedDate]);

  // Example resources (e.g., rooms, employees)
  resources.forEach((element) => {
    element.title = element.Name;
  });

  // Example events
  const [events, setEvents] = useState([]);

  // Helper function to check if an event overlaps with existing events
  const doesOverlap = async (start, end, resourceId) => {
    console.log("Checking overlap...");
    console.log(start, end, resourceId);

    // Use for...of to allow async/await to work
    for (let event of events) {
      // Ensure we compare the timestamps and the resourceId
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      const newStart = new Date(start).getTime();
      const newEnd = new Date(end).getTime();

      console.log(eventStart === newStart && event.resourceId === resourceId);

      // If overlap is detected
      if (
        ((newStart < eventEnd && newEnd > eventStart) || // Overlapping time range
          (newStart < eventStart && newEnd > eventStart) ||
          eventStart === newStart) &&
        event.resourceId === resourceId
      ) {
        return true;
      }
    }

    // No overlap found
    return false;
  };

  // Handler to add a new event
  const handleDateClick = async (arg) => {

    
   
    
    console.log(arg.dateStr);
    console.log(arg.date);
    console.log(arg);
    console.log(CxName);
    console.log(arg.resource.id);
    const title = CxName.Name;
    const resourceId = arg.resource.id; // Capture the resourceId from the clicked slot
    const resourceDet = arg.resource;
    const dateDetail = {
      date: arg.dateStr.split("T")[0],
      time: arg.dateStr.split("T")[1].split("+")[0],
    };
    const start = new Date(arg.date);
    const end = new Date(new Date(arg.date).getTime() + 90 * 60 * 1000);

    const overlap = await doesOverlap(start, end, resourceId);

    if (overlap) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An event already exist!",
      });
      return; // Don't add the event if it overlaps
    }

    if(RescheduleFlag == true){
      Swal.fire({
        title: "",
        text: "Are you sure to reschedule to this time?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          let func_name = "TestDriveReschedule13897";
          // let func_name = "TestDrive13897";
          let req_data = {
            arguments: JSON.stringify({
              Demo_Car_Assigned: resourceId,
              dateValue: arg.dateStr.split("T")[0],
              slotTime: arg.dateStr.split("T")[1].split("+")[0],
              Test_Drive_Date: arg.dateStr.split("T")[0],
              Duration: { SlotDuration },
              testDriveId:RescheduleEvent.extendedProps.testDriveId
            }),
          };
  
          ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(function (data) {
            console.log(data);
            if (data.details.output == "Success") {
              setEvents([]);
              setRescheduleFlag(false);

              let arr=[];
              resources.forEach(element => {
                arr.push(element.id);
              });
              let config = {
                select_query:
                  "select Demo_Car_Assigned,Demo_Car_Assigned.Name,Time_In,Time_Out,Lead,Lead.Full_Name,Qualified_Leads,Qualified_Leads.First_Name from ZTestDrives where Demo_Car_Assigned in "+arr+" and Test_Drive_Date='" + selectedDate+"'"
              };
              console.log(config);
              ZOHO.CRM.API.coql(config).then(function (data) {
                console.log(data);
                setPrefillData(data.data);

                // data.data.forEach(element => {
                //     console.timeLog(element);
                // });
              });
   
            }
           })
    }})
    }else{
    Swal.fire({
      title: "",
      text: "Are you sure to create a Test Drive?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        let func_name = "TestDrive13897";
        // let func_name = "TestDrive13897";
        let req_data = {
          arguments: JSON.stringify({
            Name: "123",
            Demo_Car_Assigned: resourceId,
            dateValue: arg.dateStr.split("T")[0],
            slotTime: arg.dateStr.split("T")[1].split("+")[0],
            Test_Drive_Date: arg.dateStr.split("T")[0],
            Duration: { SlotDuration },
            Entity: Entity,
            EntityId: EntityId,
          }),
        };

        ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(function (data) {
          console.log(data);
          if (data.details.output == "Duplicate Found") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Duplicate Record Found",
            });
          } else if (data.details.output == "Success") {
            Swal.fire({
              icon: "success",
              title: "",
              text: "Record Created",
            });

            console.log(Date.now())

            if (title) {
              const segment1 = {
                id: `${Date.now()}-segment1`, // Unique ID for segment 1
                title,
                resourceDet,
                start: start.toISOString(),
                end: new Date(start.getTime() + 60 * 60 * 1000).toISOString(), // First 60 min
                resourceId,
                dateDetail,
                color: "#a4e1ff", // Set color to blue for the first 60 minutes
              };

              const segment2 = {
                id: `${Date.now()}-segment2`, // Unique ID for segment 2
                resourceDet,
                start: new Date(start.getTime() + 60 * 60 * 1000).toISOString(), // Start after 60 minutes
                end: new Date(start.getTime() + 90 * 60 * 1000).toISOString(), // End after 90 minutes
                resourceId,
                dateDetail,
                color: "#f9d277", // Set color to green for the next 30 minutes
              };
              console.log("----------eventlist");
              
             
              setEvents([]);

              let arr=[];
              resources.forEach(element => {
                arr.push(element.id);
              });
              let config = {
                select_query:
                  "select Demo_Car_Assigned,Demo_Car_Assigned.Name,Time_In,Time_Out,Lead,Lead.Full_Name,Qualified_Leads,Qualified_Leads.First_Name from ZTestDrives where Demo_Car_Assigned in "+arr+" and Test_Drive_Date='" + selectedDate+"'"
              };
              console.log(config);
              ZOHO.CRM.API.coql(config).then(function (data) {
                console.log(data);
                setPrefillData(data.data);
                // data.data.forEach(element => {
                //     console.timeLog(element);
                // });
              });
   
              
              // setEvents((pre)=>[...pre,segment2]);
             
              
              
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong.Contact IT Team",
            });
          }
        });
      }
    });
    }
   

    // end.setHours(start.getHours() + 1.30); // Default end time is 1 hour later
  };
  useEffect(()=>{
    console.log(events);
  },[events])

  const handleEventClick = (info) => {
    setEventDetails(info.event);
    showmodal(true);
  };
  const [EventDetails, setEventDetails] = useState(null);

 

  useEffect(() => {
    const scrollGrid = document.querySelector(".fc-scrollgrid-liquid");
    if (!scrollGrid) return; // Early return if element is not found

    const resourceRows = resources.length == 1 ? 2 : resources.length;

    const rowHeight = 50; // Fixed height of each resource row
    const padding = 10; // Padding between each resource row
    const maxHeight = 600; // Maximum height of the scrollable resource area
    const rowThreshold = 12; // Threshold for when to enable scrolling

    // Calculate the height based on the number of rows, including padding
    const calculatedHeight = Math.min(
      resourceRows * (rowHeight + padding),
      maxHeight
    );

    // Apply the dynamic height to .fc-scrollgrid-liquid
    if (resourceRows > rowThreshold) {
      scrollGrid.style.maxHeight = `${calculatedHeight}px`;
      scrollGrid.style.overflowY = "auto"; // Enable vertical scrolling when there are too many resources
    } else {
      scrollGrid.style.height = `${calculatedHeight}px`;
      scrollGrid.style.overflowY = "hidden"; // Disable scrolling when resources are below threshold
    }
  }, [resources]);

  // useEffect(()=>{

  // },[RescheduleFlag])

  const [modal, showmodal] = useState(false);
  return (
    <>
      <ReactModal
        modal={modal}
        showmodal={showmodal}
        EventDetails={EventDetails}
        events={events}
        setEvents={setEvents}
        setRescheduleFlag={setRescheduleFlag}
        setRescheduleEvent={setRescheduleEvent}
        PrefillData={PrefillData}
      />
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef} // Attach ref to FullCalendar instance
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            resourceTimelinePlugin,
            interactionPlugin,
          ]}
          initialView="resourceTimelineDay" // Default view: Resource Timeline
          headerToolbar={{
            left: "",
            center: "title",
            right: "",
          }}
          // slotDuration="01:30:00" // Set slot duration to 90 minutes
          slotLabelInterval={SlotDuration} // Show labels for 90-minute intervals
          resources={resources} // Pass resources here
          events={events} // Pass events here
          dateClick={handleDateClick} // Event for clicking on a date to create an event
          editable={false} // Allow dragging of events
          droppable={false} // Allow dropping events to different resources
          selectable={true} // Allow selecting date range
          resourceAreaWidth="100px" // Set a fixed width for resource area
          slotMinTime={DayStartTime} // Start time at 9 AM
          slotMaxTime={DayEndTime} // End time at 11 PM
          eventClick={handleEventClick}
          // slotLabelFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }} // Format slot labels
        />
      </div>
    </>
  );
}

export default Calendar;
