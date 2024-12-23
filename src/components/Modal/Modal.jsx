import React, { useEffect, useState, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";

function ReactModal({modal,showmodal,setRescheduleFlag,EventDetails,events,setEvents,setRescheduleEvent,PrefillData}) {
    const handleModalClose = ()=>{
        showmodal(false);
    }
    console.log(EventDetails);

    const handleReschedule = () => {
        console.log(events);
        setRescheduleFlag(true);
        setRescheduleEvent(EventDetails)
        // Find the index of the event with the given ID
        const eventIndex = events.findIndex(event => event.id === EventDetails._def.publicId);
        console.log(events[eventIndex]);
        showmodal(false);
        if (eventIndex !== -1) {
           
        } else {
            console.log("Event not found!");
        }
    };

    // const handleAddCx = () => {
    //     let func_name = "TestDriveAddCx13897";
    //     // let func_name = "TestDrive13897";
    //     let req_data = {
    //       arguments: JSON.stringify({
    //         testDriveId:EventDetails.extendedProps.testDriveId,
    //         lead:PrefillData
    //       }),
    //     };

    //     ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(function (data) {
    //       console.log(data);
    //       if (data.details.output == "Success") {
    //         // setEvents([]);
    //         // setRescheduleFlag(false);
    //       }
    //       })
    // };
    
    

  return (<>
  {modal && (<div
    className="modal show">
    <Modal.Dialog aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>Edit Booking</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      
  {/* Vehicle Number */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div className="FieldLabel">
      Vehicle Number
    </div>
    <Form.Control       
            value={EventDetails._def.extendedProps.resourceDet._resource.title}
            disabled
            />
   
  </div>

  {/* Customer */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div className="FieldLabel">
      Customer
    </div>
    <Form.Control       
            value={EventDetails._def.extendedProps.custlist.Name}
            disabled
            />
  </div>

  {/* Date Details */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div className="FieldLabel">
      Date Details
    </div>
    <Form.Control       
            value= {EventDetails._def.extendedProps.dateDetail.date}
            disabled
            />
     
 
  </div>

  {/* Time Details */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div className="FieldLabel">
      Time Details
    </div>
    <Form.Control       
            value=  {EventDetails._def.extendedProps.dateDetail.time}
            disabled
            />     
  </div>
  <br></br>


        
      </Modal.Body>

      <Modal.Footer>
      <Button variant="primary" onClick={handleReschedule}>Reschedule</Button>
      {/* <Button variant="primary" onClick={handleAddCx}>Add Customer</Button> */}
      <Button variant="primary" onClick={handleModalClose}>Close</Button>
      
      </Modal.Footer>
    </Modal.Dialog>
  </div>)}
   
    </>
  );
}

export default ReactModal;