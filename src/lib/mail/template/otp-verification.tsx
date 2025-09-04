import {
  Body,
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

export const OtpVerificationTemplate = ({
  name,
  otp,
}: {
  name: string;
  otp: string;
}) => (
  <Html>
    <Head />
    <Preview>OTP for {appName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          alt={appName}
          height="42"
          src={`${appUrl}/logo.png`}
          style={logo}
          width="42"
        />
        <Heading style={heading}>OTP for {appName}</Heading>
        <Text style={paragraph}>Hi {name},</Text>
        <Section style={container}>
          <code style={code}>{otp}</code>
        </Section>
        <Text style={paragraph}>This OTP is valid for 10 minutes.</Text>
        <Hr style={hr} />
        <Link href={appUrl} style={reportLink}>
          {appName}
        </Link>
      </Container>
    </Body>
  </Html>
);
