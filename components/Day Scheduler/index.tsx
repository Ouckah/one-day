'use client'
import { useState, MouseEvent, useEffect } from "react";

export const DayScheduler = () => {

    const times = [
        "0:00",
        "0:30",
        "1:00",
        "1:30",
        "2:00",
        "2:30",
        "3:00",
        "3:30",
        "4:00",
        "4:30",
        "5:00",
        "5:30",
    ];

    const [selected, setSelected] = useState<{
        start: string; end: string 
    }>();
    const [state, setState] = useState<{
        appointments: { [key: string]: { start: string; end: string } };
        startTimes: string[];
    }>({
        appointments: {
            "0:00": {
                start: "0:00",
                end: "1:00",
            }
        },
        startTimes: [
            "0:00",
        ]
    });

    const handleAppointment = (e: MouseEvent, key: number) => {
        e.preventDefault();

        const time = times[key];

        // check if new appointment
        if (!state.startTimes.includes(time)) {
            const startTime = times[key];
            const endTime = key != times.length - 1 ? times[key + 1] : times[0];

            const newAppointment: { [appointmentKey: string]: { start: string, end: string } } = {};
            newAppointment[startTime] = {
                start: startTime,
                end: endTime,
            };

            addAppointment(newAppointment);
        } else {
            selectAppointment(time);
        }
    }

    const addAppointment = (appointment: { [key: string]: { start: string; end: string } }) => {
        const startTime = Object.keys(appointment)[0]; // Extract the start time from the keys of the appointment object
        const appointmentContent = appointment[startTime];
    
        // Update the startTimes array with the new start time
        const updatedStartTimes = [...state.startTimes, startTime];
    
        // Create a new copy of the appointments object with the new appointment added
        const updatedAppointments = {
            ...state.appointments,
            ...appointment,
        };
    
        setState({
            ...state,
            appointments: updatedAppointments,
            startTimes: updatedStartTimes,
        });

        setSelected(appointmentContent);
    };

    const selectAppointment = (key: string) => {
        const appointment = state.appointments[key];
        setSelected(appointment);
    }
    
    const clearSelectedAppointment = () => {
        if (!selected) return;
        setSelected({start: '', end: ''});
    }

    const deleteSelectedAppointment = () => {
        if (!selected) return;
        const appointmentKey = selected.start;

        // delete from appointments
        let updatedAppointments = state.appointments;
        delete updatedAppointments[appointmentKey];

        // delete from start times
        let updatedStartTimes = state.startTimes;
        const index = updatedStartTimes.indexOf(appointmentKey);
        updatedStartTimes.splice(index, 1);

        // update state
        setState({
            ...state,
            appointments: updatedAppointments,
            startTimes: updatedStartTimes
        });

        // clear selection
        clearSelectedAppointment();
    }

    useEffect(() => {
        selected ? (selectAppointment(selected.start)) : (null)
    }, [selected])

    return (
        <>
            <div className="flex flex-row w-full h-full bg-black">
                
                <div className="flex flex-col w-1/2 h-full bg-gray-200 rounded-2xl py-3">
                    <div className="w-full h-full overflow-y-scroll no-scrollbar">
                        {
                            times.map((time, index) => (
                                <button 
                                    className="flex flex-row justify-start items-center w-full h-24 p-5 gap-5 bg-green-500" 
                                    onClick={(e) => handleAppointment(e, index)} key={index}
                                >
                                    <h1>{time}</h1>
                                    {
                                        state.startTimes.includes(time) ? (
                                            <div className="w-5/6 h-full bg-orange-500">

                                            </div>
                                        ) : (<></>)
                                    }
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col justify-start items-start w-1/2 h-full bg-gray-200 rounded-2xl p-3">
                    {
                        selected ? (
                            <>

                                <div className="flex flex-row justify-between items-center w-full h-24">
                                    <button onClick={clearSelectedAppointment}>X</button>
                                    <input className="w-1/2 h-12 bg-gray-200 border-b-gray-500 border-b-2 text-gray-500 text-lg font-bold p-3 focus:outline-none"/>
                                    <button onClick={deleteSelectedAppointment}>Delete</button>
                                </div>
                                <div className="flex flex-col w-full h-full px-24 py-10">
                                    <div className="flex flex-row items-center w-full h-16 gap-4">
                                        <input 
                                            className="flex text-center w-28 h-full rounded-2xl focus:outline-none" 
                                            placeholder={selected.start} 
                                        />
                                        <h1>to</h1>
                                        <input 
                                            className="flex text-center w-28 h-full rounded-2xl focus:outline-none"
                                            placeholder={selected.end} 
                                        />
                                    </div>
                                </div>
                            
                            </>
                        ) : (
                            <>
                            
                                <h1>none.</h1>
                            
                            </>
                        )
                    }
                </div>
            
            </div>
        </>
    )

}