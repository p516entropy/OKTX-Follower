import React, {Component} from 'react';
import './style.css';
import FilterConditionModal from "../FilterConditionModal";
import ActiveSubs from "../ActiveSubs";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSubAddressInput: "",
      newSub: {
        address: "",
        selectedChannels: [],
        conditions: []
      },
      activeSubs: [],
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
      methodNames: []
    };
  }




  async componentDidMount() {
    const activeSubsResponse = await fetch(`/api/subscription`);
    const activeSubs = await activeSubsResponse.json();
    this.setState({ activeSubs });
  }


  changeNewSubAddress = async () => {
    console.log("changeNewSubAddress", this.state.newSubAddressInput)
    const currentNewSub = this.state.newSub;
    currentNewSub.address = this.state.newSubAddressInput;
    const methodNamesResponse = await fetch(`/api/abi/${currentNewSub.address}`);
    const methodNames = await methodNamesResponse.json();
    this.setState({newSub: currentNewSub, methodNames});
  }

  clearNewSub = () => {
    console.log("clearNewSub", this.state.newSubAddressInput)
    this.setState({newSub: {}, newSubAddressInput: ""});
  }

  subscribe = () => {
    console.log("subscribe", this.state.newSub)
    const currentActiveSubs = this.state.activeSubs || [];
    const newSub = {...this.state.newSub};
    newSub.triggered = 0;
    newSub.selectedChannels = Object.keys(newSub.selectedChannels)

    fetch('/api/subscription', {
      method: 'POST',
      body: JSON.stringify(newSub),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((subscription) => {
        this.setState({newSub: {}, newSubAddressInput: "", activeSubs: [subscription, ...currentActiveSubs]});
        console.log([subscription, ...currentActiveSubs])
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  updateConditions = (newCondition) => {
    console.log("updateConditions", newCondition)
    const currentNewSub = this.state.newSub
    currentNewSub.conditions = [...(currentNewSub.conditions || []), newCondition]
    this.setState({newSub: currentNewSub})
  }

  toggledChannel = (channelStatus) => {
    console.log("clearNewSub", channelStatus)
    const newSub = this.state.newSub;
    newSub.selectedChannels = {...(newSub.selectedChannels || {}), ...channelStatus}
    this.setState({newSub})
  }

  removeCondition = (conditionToRemove) => {
    console.log("removeCondition", conditionToRemove)
    const newSub = this.state.newSub;
    const conditions = newSub.conditions || []
    newSub.conditions = conditions.filter((condition) => condition.config.name !== conditionToRemove.config.name)
    this.setState({newSub})
  }

  canSubscribe = () => {
    const selectedChannels = this.state.newSub.selectedChannels || {};
    for (let selectedChannelsKey in selectedChannels) {
      if (selectedChannels[selectedChannelsKey]) {
        return true
      }
    }
    return false
  }

  render() {
    return (
      <div className="m-auto" style={{"maxWidth": "45rem"}}>
        <div className="card mt-5 mb-5">
          {!!this.state.newSub.address &&
            <div className="position-absolute m-3 top-0 end-0">
              <button type="button" className="btn-close" aria-label="Close" onClick={this.clearNewSub}></button>
            </div>
          }
          <div className="card-body">
            <h5 className="card-title">New subscription</h5>
            {!!this.state.newSub.address ?
              (<ul className="list-group list-group-flush">
                <li className="list-group-item">Contract address: <strong>{this.state.newSub.address}</strong>
                  <div>
                    {this.state.methodNames.length > 0
                      ?
                      < span className="badge text-bg-success">ABI available</span>
                      :
                      < span className="badge text-bg-warning">ABI not available</span>
                    }
                  </div>
                </li>
              </ul>)
              :
              (<div className="row d-flex justify-content-center align-items-center">
                <div>
                  <div className="search">
                    <i className="fa fa-search"></i>
                    <input type="text"
                           className="form-control"
                           placeholder="contract address 0x..."
                           onChange={(event) => {
                             this.setState({newSubAddressInput: event.target.value})
                           }}/>
                    <button className="btn btn-primary" onClick={this.changeNewSubAddress}>
                      Create
                    </button>
                  </div>

                </div>

              </div>)
            }
          </div>
          {!!this.state.newSub.address && (
            <>
              <div className="border-bottom"></div>
              <div className="card-body">
                <div className="d-flex">
                  <h5 className="card-title">Filter</h5>
                  <div className="w-100">
                    <button className="btn float-end pt-0"
                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                            style={{color: "#6370e5"}}>+ Condition
                    </button>
                  </div>
                </div>
                {!!this.state.newSub.conditions && (
                  <ul className="list-group list-group-flush">
                    {this.state.newSub.conditions.map((condition, i) => {
                      return (
                        <li key={i} className="list-group-item d-flex">
                          <div className="col-10">{condition.config.label}: <strong>{condition.value}</strong></div>
                          <div className="col-2">
                            <button className="btn float-end p-0" onClick={() => this.removeCondition(condition)}>
                              <i className="bi bi-bucket"></i>
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>)
                }
              </div>
              <div className="border-bottom"></div>
              <div className="card-body">
                <h5 className="card-title me-3">Channels</h5>
                <ul className="list-group list-group-flush">
                  {this.state.channels.map(channel => {
                    return (
                      <li className="list-group-item" key={channel.name}>
                        <div className="row">
                          <span className="col-4">{channel.label}</span>
                          <div className="col-8">
                            <div className="float-end form-check form-switch">
                              <input className="form-check-input" type="checkbox" role="switch"
                                     disabled={!channel.available}
                                     onClick={(event) => this.toggledChannel({[channel.name]: event.target['checked']})}/>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="card-footer text-end">
                <button className="btn btn-primary" disabled={!this.canSubscribe()} onClick={this.subscribe}>
                  Subscribe
                </button>
              </div>
            </>
          )}

        </div>
        <FilterConditionModal
          methodNames={this.state.methodNames}
          onSaveCondition={(newCondition) => this.updateConditions(newCondition)}></FilterConditionModal>
        <ActiveSubs channels={this.state.channels} activeSubs={this.state.activeSubs}></ActiveSubs>
        <div className="mb-5"></div>
      </div>
    )
  }
}

export default Contact;