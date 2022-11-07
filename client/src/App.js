import {useEffect, useState} from "react";

const UNKNOWN = "UNKNOWN"
const UNAVAILABLE = "UNAVAILABLE"

function App() {
  const [service1state, service1SetState] = useState(UNKNOWN);
  const [service2state, service2SetState] = useState(UNKNOWN);
  const [service3state, service3SetState] = useState(UNKNOWN);

  useEffect(() => {
    fetch('/api/service1/ping')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            service1SetState(data);
        }).catch(() => {
      service1SetState(UNAVAILABLE)
    });
  }, []);

  useEffect(() => {
    fetch('/api/service2/ping')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            service2SetState(data);
        }).catch(() => {
      service2SetState(UNAVAILABLE)
    });
  }, []);

    useEffect(() => {
        fetch('/api/service3/ping')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                service3SetState(data);
            }).catch(() => {
            service3SetState(UNAVAILABLE)
        });
    }, []);

  return (
    <div>
        service1 status: { service1state }<br/>
        service2 status: { service2state }<br/>
        service3 status: { service3state }
    </div>
  );
}

export default App;
