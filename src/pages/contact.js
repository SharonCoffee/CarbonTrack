import React from 'react';
import { Container, Header, Segment, Form, Button, Input, TextArea } from 'semantic-ui-react';

const Contact = () => {
  return (
      <Container>
        <Header as='h1' textAlign='center' style={{ margin: '20px 0' }}>
          Contact Us
        </Header>
        <Segment>
          <Header as='h2'>Get in Touch</Header>
          <p>
            Whether you&apos;re seeking more information about improving your BerRating, interested in partnership opportunities, or have any questions about our platform, we&apos;re here to help. Reach out to us, and let&apos;s drive positive change together.
          </p>
          <Form>
            <Form.Field
                control={Input}
                label='Name'
                placeholder='Your Name'
            />
            <Form.Field
                control={Input}
                label='Email'
                placeholder='Your Email'
                type='email'
            />
            <Form.Field
                control={TextArea}
                label='Message'
                placeholder='Your Message'
            />
            <Button type='submit' primary>
              Submit
            </Button>
          </Form>
        </Segment>
      </Container>
  );
};

export default Contact;
