import { Row, Col } from 'react-bootstrap';


export default function Banner({data}) {

    console.log(data);
    const {title, content} = data;

    return (
        <Row>
            <Col>
                <h1>{title}</h1>
                <p>{content}</p>
            </Col>
        </Row>
    )
}