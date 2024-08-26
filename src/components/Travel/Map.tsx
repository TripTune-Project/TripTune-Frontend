// components/Travel/Map.tsx
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
	width: "100%",  // 이 부분이 50%에서 100%로 변경되었습니다.
	height: "100%",
};

const defaultCenter = {
	lat: 37.5665, // 서울의 위도
	lng: 126.9780, // 서울의 경도
};

const Map: React.FC = () => {
	const [currentPosition, setCurrentPosition] = useState(defaultCenter);
	
	useEffect(() => {
		const getUserLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						setCurrentPosition({
							lat: latitude,
							lng: longitude,
						});
					},
					(error) => {
						console.error("Error getting user's location: ", error);
					}
				);
			} else {
				console.error("Geolocation is not supported by this browser.");
			}
		};
		
		getUserLocation();
	}, []);
	
	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
			<GoogleMap mapContainerStyle={containerStyle} center={currentPosition} zoom={10}>
				{/* 추가적인 마커나 기능은 여기서 추가할 수 있습니다 */}
			</GoogleMap>
		</LoadScript>
	);
};

export default Map;
