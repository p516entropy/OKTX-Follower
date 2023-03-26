import React, {Component} from 'react';
import './style.css';

class ActiveSubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSubs: props.activeSubs,
      channels: [
        {
          label: "Telegram",
          name: "telegram",
          available: true
        },
        {
          label: "Email",
          name: "email",
          available: false
        }
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeSubs !== this.state.activeSubs) {
      this.setState({ activeSubs: nextProps.activeSubs });
    }
  }

  deleteSubscription = (index) => {
    console.log("deleteSubscription", index)
    const currentActiveSubs = this.state.activeSubs;
    fetch(`/api/subscription/${this.state.activeSubs[index].id}`, {
      method: 'DELETE',
    })
      .then(() => {
        currentActiveSubs.splice(index, 1)
        this.setState({activeSubs: currentActiveSubs});
      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  render() {
    return <>
      {this.state.activeSubs.length > 0 &&
        <h5 className="mb-3">Active subscriptions</h5>
      }
      {this.state.activeSubs.map((activeSub, i) => {
        return (<div className="card mb-3" key={activeSub.id}>
          <div className="card-body" data-bs-toggle="collapse" data-bs-target={"#collapse" + activeSub.id} >
            <div className="row">
                <span className="col-7 border-end">Contract address: <strong>{activeSub.address}</strong>
                </span>
              <span className="col-5">Triggered: <strong className="float-end">{activeSub.triggered}</strong>
                </span>
            </div>
          </div>
          <div className="collapse" id={"collapse" + activeSub.id}>
            {!!activeSub.conditions && activeSub.conditions.length !== 0 && (
              <>
                <div className="border-bottom"></div>
                <div className="card-body">
                  <div className="d-flex">
                    <h5 className="card-title">Filter</h5>
                  </div>
                  <ul className="list-group list-group-flush">
                    {activeSub.conditions.map((condition, i) => {
                      return (
                        <li key={i} className="list-group-item d-flex">
                          <div className="col-10">{condition.config.label}: <strong>{condition.value}</strong></div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </>
            )}
            <div className="border-bottom"></div>
            <div className="card-body">
              <h5 className="card-title me-3">Channels</h5>
              <ul className="list-group list-group-flush">
                {this.props.channels.map(channel => {
                  return (
                    <li className="list-group-item" key={channel.name}>
                      <div className="row">
                        <span className="col-4">{channel.label}</span>
                        <div className="col-8">
                          <div className="float-end form-check form-switch">
                            <input checked={activeSub.selectedChannels.some(activeChannel => activeChannel === channel.name)}
                                   className="form-check-input" type="checkbox" role="switch"
                                   disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="card-footer text-end">
              <button className="btn btn-danger" onClick={() => this.deleteSubscription(i)}>
                Delete
              </button>
            </div>
          </div>
        </div>)
      })}</>
  }
}

export default ActiveSubs;