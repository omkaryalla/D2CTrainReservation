import './App.css';
import React from 'react';

const fetch = require('node-fetch');
const {base_url} = require('./config')

class Seat extends React.Component {
    render() {
        let className = this.props.booked != null ? 'seat ' : 'seat_loading';
        className += this.props.booked === 1 ? "booked" : this.props.booked === 2 ? "booked_now" : ""
        className += this.props.number % 7 === 3 ? " path" : ""
        return (
            <div className={className} style={this.props.style}>
                {this.props.number}
            </div>
        );
    }
}

class Train extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seatState: Array(80).fill(null),
            selectedSeatCount: 1,
            clearButton: {
                class: "sqe_button",
                text: 'Clear'
            },
            bookButton: {
                class: "sqe_button",
                text: 'Book'
            }
        };
    }

    updateBookedSeats() {
        let options = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(base_url, options)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let local_seats = Array(80).fill(0);
                const booked_seats = json.map(each => each['_id']);
                booked_seats.forEach(e => {
                    local_seats[e - 1] = 1;
                })
                this.setState({
                    seatState: local_seats
                })
            })
            .catch(err => console.error('error:' + err));
    }

    componentDidMount() {
        this.updateBookedSeats();
    }

    render() {
        let gridStyle = {display: "grid", justifyContent: "center"};
        let isMobile = window.innerWidth <= 700;
        if(!isMobile){
            gridStyle.gridTemplateColumns = "repeat(3, auto)";
        }
        return (
            <div className="App">
                <span style={{fontSize: "xx-large", margin: "auto", paddingTop: "1rem"}}>Book your Tickets</span>
                <div style={gridStyle} >
                    <p style={{lineHeight: "2rem", display: "inline-block"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{width: "1rem", height: "1rem", backgroundColor: "#1fd262", borderRadius: "0.2rem"}}></div>
                            <div style={{marginLeft: "0.5rem"}}>Booked</div>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{width: "1rem", height: "1rem", backgroundColor: "#d2ca1f", borderRadius: "0.2rem"}}></div>
                            <div style={{marginLeft: "0.5rem"}}>You Just Booked</div>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{width: "1rem", height: "1rem", backgroundColor: "#ffffff", borderRadius: "0.2rem"}}></div>
                            <div style={{marginLeft: "0.5rem"}}>Available</div>
                        </div>
                    </p>
                    <div className="seats_layout" style={{margin: isMobile ? "0rem 0rem" : "0rem 2rem"}}>
                        {this.state.seatState.map((e, i) => <Seat
                            number={i + 1} booked={e}/>)}
                    </div>
                    <div>
                        <div style={{marginBottom: "1rem"}}>
                            <p>Seats</p>
                            <select onChange={(e) => {
                                this.setState({selectedSeatCount: e.target.value})
                            }}>
                                {Array(7).fill(null).map((_, i) => <option value={i + 1}> {i + 1} </option>)}
                            </select>
                        </div>

                        <button className={this.state.bookButton.class} onClick={() => {
                            this.setState({
                                bookButton: {
                                    class: "sqe_button button_expand",
                                    text: "Booking ..."
                                }
                            })
                            let options = {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: `{"count": ${this.state.selectedSeatCount}}`
                            };

                            fetch(base_url + "/book", options)
                                .then(res => res.json())
                                .then(json => {
                                    if ('msg' in json) {

                                    }
                                    let now_booked = json.now_booked;
                                    let already_booked = json.booked;
                                    let local_seats = Array(80).fill(0);
                                    const booked_seats = already_booked.map(each => each['_id']);
                                    booked_seats.forEach(e => {
                                        local_seats[e - 1] = 1;
                                    })
                                    now_booked.forEach(e => {
                                        local_seats[e - 1] = 2;
                                    })
                                    this.setState({
                                        seatState: local_seats,
                                        bookButton: {
                                            class: "sqe_button",
                                            text: "Book"
                                        }
                                    })
                                })
                                .catch(err => console.error('error:' + err));
                        }}>{this.state.bookButton.text}
                        </button>
                    </div>
                </div>
                <button className={this.state.clearButton.class} style={{marginTop: "1rem", backgroundColor: "#e91e1e", color: "white"}} onClick={() => {
                    this.setState({
                        clearButton: {
                            class: "sqe_button button_expand",
                            text: "Clearing..."
                        }
                    })
                    let options = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                    };

                    fetch(base_url + "/clear", options)
                        .then(() => {
                            this.setState({
                                seatState: Array(80).fill(0),
                                clearButton: {
                                    class: "sqe_button",
                                    text: "Clear"
                                }
                            })
                        })
                        .catch(err => console.error('error:' + err));
                }}>{this.state.clearButton.text}
                </button>
            </div>
        );
    }
}

function App() {
    return (
        <div>
            <Train/>
        </div>
    );
}

export default App;
