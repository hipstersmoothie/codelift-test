import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  scalar JSON
  scalar JSONObject

  type Mutation {
    """
    Open file in IDE at specific line
    """
    openInIDE(
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): Boolean

    """
    Add/remove the provided className from the Component
    """
    toggleClassName(
      """
      className to toggle within the attribute string
      """
      className: String!
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): String

    """
    Replace or remove the Component's className
    """
    updateClassName(
      """
      Entire className attribute (null to remove)
      """
      className: String
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): String

    """
    Add, replace, or remove props on a Component
    """
    updateProps(
      """
      Props to update (undefined to remove)
      """
      props: JSONObject!
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): JSONObject
  }

  type Query {
    version: String!
  }
`;
