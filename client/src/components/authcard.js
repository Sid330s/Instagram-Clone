import styled from "styled-components";

export const FormWrapper = styled.div`
  padding: 1rem !important;
  width: 350px !important;
  border-radius: 25px;
  border: 1px solid #73AD21 !important;
  margin: 6rem auto !important;
  text-align: center ;



  img {
    margin-bottom: 1.5rem !important;
  }
  input {
    display: block !important;

    margin-bottom: 1rem !important;
    padding: 0.5rem 1.2rem !important;
    background: ${(props) => props.theme.white} !important;
    border-radius: 4px !important;
    border: 1px solid #73AD21 !important;
    font-family: "Fira Sans", sans-serif !important;
    font-size: 1rem !important;

    width: 100% !important;
  }
  input[type="submit"] {
    background-color: ${(props) => props.theme.blue} !important;
    color: ${(props) => props.theme.white} !important;
    border: 1px solid ${(props) => props.theme.blue} !important;
    cursor: pointer !important;
  }
  p {
    margin-top: 2rem !important;
  }
`;
