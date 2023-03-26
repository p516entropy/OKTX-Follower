import React, {Component} from 'react';
import './style.css';

class FilterConditionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProperty: null,
      value: null
    }
  }

  config = [
    {
      name: "methodName",
      label: "Method name",
      type: "abiSelector",
      requires: "abi"
    },
    {
      name: "args",
      label: "Method args",
      type: "text",
      placeholder: "=arg1,>arg2,<=arg3",
      requires: "abi"
    },
    {
      name: "from",
      label: "From",
      type: "text",
      placeholder: "0x1234567"
    }
  ]

  selectProperty = (key) => {
    console.log("selectProperty", key)
    this.setState({
      selectedProperty: this.config.find(configObj => configObj.name === key),
      value: null
    })
  }

  setConditionValue = (value) => {
    if (value === "-") {
      console.log("setConditionValue exit", "-")
      this.setState({value: null})
      return;
    }
    console.log("setConditionValue", value)
    this.setState({value})
  }

  saveCondition = () => {
    this.props.onSaveCondition && this.props.onSaveCondition ({
      config: this.state.selectedProperty,
      value: this.state.value
    })
    this.setState({
      selectedProperty: null,
      value: null
    })
    console.log("saveCondition")
  }

  render() {
    return (
      <>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">New condition</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div >
                  <select value={(this.state.selectedProperty || {name: "-"}).name} onChange={(event) => this.selectProperty(event.target.value)}
                          className="form-select mb-2">
                    <option value="-">Choose transaction data...</option>
                    {this.config.filter((configOption) => !(configOption.requires === "abi" && this.props.methodNames.length === 0))
                      .map(configOption => {
                      return <option value={configOption.name} key={configOption.name}>{configOption.label}</option>
                    })}
                  </select>
                  {!!this.state.selectedProperty &&
                    (this.state.selectedProperty.type === "abiSelector"
                      ?
                      (
                        <select defaultValue="-" onChange={(event) => this.setConditionValue(event.target.value)}
                                className="form-select mb-2" >
                          <option value="-">Choose method name based on ABI...</option>
                          {this.props.methodNames.map((methodName, i) => {
                            return <option value={methodName} key={i}>{methodName}</option>
                          })}
                        </select>
                      )
                      : (
                        <input type="text" className="form-control"
                               onChange={(e) => {this.setConditionValue(e.target.value)}}
                               placeholder={this.state.selectedProperty.placeholder}/>
                      ))
                  }
                </div>
              </div>
              <div className="modal-footer">
                <button type="button"
                        disabled={!this.state.selectedProperty || !this.state.value}
                        className="btn btn-primary"
                        onClick={this.saveCondition} data-bs-dismiss="modal">Save</button>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }
}

export default FilterConditionModal;