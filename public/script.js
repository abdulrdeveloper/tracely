const socket = io();

const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const remoteMarkers = new Map();

socket.on("server:location:update", ({ id, latitude, longitude }) => {
    if (id === socket.id) return;

    let marker = remoteMarkers.get(id);

    if (!marker) {
        marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`Rider: ${id.slice(0, 6)}`);
        remoteMarkers.set(id, marker);
    } else {
        marker.setLatLng([latitude, longitude]);
    }
});

socket.on("server:location:remove", (id) => {
    const marker = remoteMarkers.get(id);
    if (!marker) return;

    marker.remove();
    remoteMarkers.delete(id);
});

function getUsersCurrentLocation() {
    return new Promise((res, rej) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    res({ latitude, longitude });
                },
                (err) => rej(err),
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
        } else {
            rej(new Error('Geolocation is not available in this browser'));
        }
    });
}

let myCurrentLocationMarker = null;

async function sendMyLocation() {
    try {
        const { latitude, longitude } = await getUsersCurrentLocation();
        socket.emit("client:location:update", { latitude, longitude });

        if (!myCurrentLocationMarker) {
            myCurrentLocationMarker = L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup('You are here');
            map.setView([latitude, longitude], 16);
        } else {
            myCurrentLocationMarker.setLatLng([latitude, longitude]);
            map.panTo([latitude, longitude]);
        }
    } catch (err) {
        console.warn('Could not get your location:', err.message);
    }
}

function main() {
    sendMyLocation();
    setInterval(sendMyLocation, 10 * 1000);
}

window.addEventListener('load', main);
