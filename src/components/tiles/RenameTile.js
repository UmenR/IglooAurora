import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class RenameTileDialog extends React.Component {
  state = { customName: null }

  rename = () => {
    this.props[
      this.props.value.__typename === "FloatValue"
        ? "RenameFloatValue"
        : this.props.value.__typename === "StringValue"
          ? "RenameStringValue"
          : this.props.value.__typename === "ColourValue"
            ? "RenameColourValue"
            : this.props.value.__typename === "PlotValue"
              ? "RenamePlotValue"
              : this.props.value.__typename === "StringPlotValue"
                ? "RenameStringPlotValue"
                : this.props.value.__typename === "MapValue"
                  ? "RenameMapValue"
                  : "RenameBooleanValue"
    ]({
      variables: {
        id: this.props.value.id,
        customName: this.state.customName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        [this.props.value.__typename === "FloatValue"
          ? "floatValue"
          : this.props.value.__typename === "StringValue"
            ? "stringValue"
            : this.props.value.__typename === "ColourValue"
              ? "colourValue"
              : this.props.value.__typename === "PlotValue"
              ? "plotValue"
              : this.props.value.__typename === "StringPlotValue"
                ? "stringPlotValue"
                : this.props.value.__typename === "MapValue"
                  ? "mapValue"
                  : "booleanValue"]: {
          __typename: this.props.value.__typename,
          id: this.props.value.id,
          customName: this.state.customName,
        },
      },
    })
    this.props.handleRenameTileDialogClose()
  }

  render() {
    const renameTileActions = [
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={this.props.handleRenameTileDialogClose}
          style={{ marginRight: "4px" }}
        >
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.rename}
          disabled={!this.state.customName}
        >
          Rename
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Rename card"
        actions={renameTileActions}
        open={this.props.renameTileOpen}
        onRequestClose={this.props.handleRenameTileDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        <TextField
          floatingLabelText="Card name"
          defaultValue={this.props.tileName}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
          style={{ width: "100%" }}
          onChange={event => this.setState({ customName: event.target.value })}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.rename()
            }
          }}
        />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $customName: String) {
      floatValue(id: $id, customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "RenameFloatValue",
  }
)(
  graphql(
    gql`
      mutation Rename($id: ID!, $customName: String) {
        floatValue(id: $id, customName: $customName) {
          id
          customName
        }
      }
    `,
    {
      name: "RenameStringValue",
    }
  )(
    graphql(
      gql`
        mutation Rename($id: ID!, $customName: String) {
          floatValue(id: $id, customName: $customName) {
            id
            customName
          }
        }
      `,
      {
        name: "RenameColourValue",
      }
    )(
      graphql(
        gql`
          mutation Rename($id: ID!, $customName: String) {
            booleanValue(id: $id, customName: $customName) {
              id
              customName
            }
          }
        `,
        {
          name: "RenameBooleanValue",
        }
      )(
        graphql(
          gql`
            mutation Rename($id: ID!, $customName: String) {
              plotValue(id: $id, customName: $customName) {
                id
                customName
              }
            }
          `,
          {
            name: "RenamePlotValue",
          }
        )(
          graphql(
            gql`
              mutation Rename($id: ID!, $customName: String) {
                stringPlotValue(id: $id, customName: $customName) {
                  id
                  customName
                }
              }
            `,
            {
              name: "RenameStringPlotValue",
            }
          )(
            graphql(
              gql`
                mutation Rename($id: ID!, $customName: String) {
                  mapValue(id: $id, customName: $customName) {
                    id
                    customName
                  }
                }
              `,
              {
                name: "RenameMapValue",
              }
            )(RenameTileDialog)
          )
        )
      )
    )
  )
)
