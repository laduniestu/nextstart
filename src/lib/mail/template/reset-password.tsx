import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'jsx-email';
import { APP_NAME, APP_URL } from '@/config';

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const appName = APP_NAME;
const appUrl = APP_URL;
export const ResetPasswordTemplate = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => (
  <Html>
    <Head />
    <Preview>{appName} reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img alt={appName} height="33" src={`${appUrl}/logo.png`} width="40" />
        <Section>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Someone recently requested a password change for your {appName}
            account. If this was you, you can set a new password here:
          </Text>
          <Button
            backgroundColor="#007ee6"
            borderRadius={4}
            fontSize={15}
            height={42}
            href={url}
            textColor="#fff"
            width={210}
          >
            Reset password
          </Button>
          <Text style={text}>
            If you don&apos;t want to change your password or didn&apos;t
            request this, just ignore and delete this message.
          </Text>
          <Text style={text}>
            To keep your account secure, please don&apos;t forward this email to
            anyone.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
