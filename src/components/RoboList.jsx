import { useEffect, useRef, useState } from "react";
import RoboCard from "./RoboCard";
import { getRobots } from "../services/robots";


const RoboList = () => {
    const [robot, setRobot] = useState(null);
    const [robots, setRobots] = useState([]);
    const [images, setImages] = useState({});
    const observerRef = useRef(null);

    const fetchRobots = async () => {
        try {
            const newRobots = await getRobots();
    
            // Ensure newRobots is an array
            if (Array.isArray(newRobots)) {
                setRobots(prevRobots => [...prevRobots, ...newRobots]);
                fetchImages(newRobots);
            }
        } catch (error) {
            console.error('Error fetching robots:', error);
        }
    };

    const fetchImages = (newRobots) => {
        const newImages = {};
        for (const robot of newRobots) {
            const imgUrl = `https://robohash.org/${robot.email}?gravatar=yes`;
            newImages[robot.id] = imgUrl;
        }
        setImages(prevImages => ({ ...prevImages, ...newImages }));
    };

    // ensure robots are fetch before reaching screen's bottom
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries =>  {
            const lastCard = entries[0];
            if (lastCard.isIntersecting) {
                fetchRobots();
            }
        }, { rootMargin: '500px'});
        
        const lastCardElement = document.querySelector('.card:last-child');
        if (lastCardElement) {
            observerRef.current.observe(lastCardElement);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };   
    }, [robots]);

    useEffect(() => {
        fetchRobots();
    }, []);

    // handle details view on phone-view
    const handleRobotClick = (id) => {
        setRobot(robots.find(robot => robot.id === id));
    }

    return (
        <>
            {
                robot && <div className="phone-view-details">
                    <p>{`${robot.first_name} ${robot.last_name}`}</p>
                    <p>{robot.email}</p>
                    <p>{robot.phone_number}</p>
                </div>
            }
            <div className="card-list">
                {robots.map(robot => {
                    return <RoboCard
                        key={robot.id}
                        id={robot.id}
                        name={`${robot.first_name} ${robot.last_name}`}
                        email={robot.email}
                        phone={robot.phone_number}
                        image={images[robot.id]}
                        handleClick={handleRobotClick}
                    />
                })}
            </div>
        </>
    );
};


export default RoboList;