import React from 'react';
import axios from 'axios';

class Fib extends React.Component {
    state = {
        seenIndexes: [{ num: 1 }, { num: 2 }, { num: 3 }],
        values: { 1: 1 },
        index: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const { data } = await axios.get('/api/values/current');
        this.setState({ values: data });
    }

    async fetchIndexes() {
        const { data } = await axios.get('/api/values/all');
        this.setState({ seenIndexes: data });
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ num }) => num).join(', ');
    }

    /**
     * @param {Event} event 
     */
    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: '' });
    };

    render() {
        return (
            <div style={{ marginTop: '1em' }}>
                <form onSubmit={this.handleSubmit}>
                    <label>Index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>

                <h3>Indexes seen</h3>
                {this.renderSeenIndexes()}
                <h3>Computed values</h3>
                {Object.keys(this.state.values).map(key => (
                    <div key={key}>
                        {key} = {this.state.values[key]}
                    </div>
                ))}
            </div>
        );
    }
}

export default Fib;
