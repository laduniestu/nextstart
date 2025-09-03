import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'jsx-email';
import { APP_NAME, APP_URL } from '@/config';

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
  margin: '0 auto',
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const code = {
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  color: '#3c4149',
};

const appName = APP_NAME;
const appUrl = APP_URL;

export const EmailVerificationTemplate = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => (
  <Html>
    <Head />
    <Preview>Email Verification for {appName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          alt={appName}
          height="42"
          src={`${appUrl}/logo.png`}
          style={logo}
          width="42"
        />
        <Heading style={heading}>Email Verification for {appName}</Heading>
        <Text style={paragraph}>Hi {name},</Text>
        <Section style={buttonContainer}>
          <Button
            backgroundColor="#5e6ad2"
            borderRadius={3}
            fontSize={15}
            height={40}
            href={url}
            textColor="#fff"
            width={152}
          >
            Verify Email
          </Button>
        </Section>
        <Text style={paragraph}>
          If you did not sign up for an account at {appName}, please ignore this
          message. If you are unable to use the button above to verify your
          email, you can use the link below to complete your verification.
        </Text>
        <code style={code}>{url}</code>
        <Hr style={hr} />
        <Link href={appUrl} style={reportLink}>
          {appName}
        </Link>
      </Container>
    </Body>
  </Html>
);
