// app/components/MeetingInvite.tsx
'use client'

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

interface Attendee {
  email: string;
  displayName?: string;
}

export default function MeetingInvite() {
  const { msalInstance, account } = useAuth();
  const [subject, setSubject] = useState('会議のお知らせ');
  const [body, setBody] = useState('会議にご参加ください。');
  const [location, setLocation] = useState('オンライン');
  const [startDateTime, setStartDateTime] = useState('2025-04-03T15:00:00');
  const [endDateTime, setEndDateTime] = useState('2025-04-03T16:00:00');
  const [attendees] = useState<Attendee[]>([
    { email: 'sembat@tech0jp.onmicrosoft.com' },
    { email: 'tech0i@tech0jp.onmicrosoft.com' },
    { email: 'tech0j@tech0-jp.com' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendMeetingInvite = async () => {
    if (!msalInstance || !account) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // トークンの取得
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: [
          'Calendars.ReadWrite'
        ],
        account: account
      }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          return await msalInstance.acquireTokenPopup({
            scopes: [
              'Calendars.ReadWrite'
            ]
          });
        }
        throw error;
      });

      // 会議依頼データの準備
      const timeZone = 'Asia/Tokyo';
      const meetingRequest = {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: body
        },
        start: {
          dateTime: startDateTime,
          timeZone: timeZone
        },
        end: {
          dateTime: endDateTime,
          timeZone: timeZone
        },
        location: {
          displayName: location
        },
        attendees: attendees.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.displayName || attendee.email
          },
          type: 'required'
        })),
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
      };

      console.log('Meeting Request Payload:', meetingRequest);

      // Graph APIを呼び出して会議依頼を作成
      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(meetingRequest)
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log('Meeting created successfully:', responseData);
        setSuccess('会議依頼を送信しました');
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        throw new Error('会議依頼の送信に失敗しました');
      }
    } catch (err) {
      console.error('Error sending meeting invite:', err);
      setError('会議依頼の送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>会議依頼の送信</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">件名</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="body">本文</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="location">場所</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDateTime">開始日時</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDateTime">終了日時</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>参加者</Label>
            <div className="space-y-2 mt-1">
              {attendees.map((attendee, index) => (
                <div key={index} className="p-2 border rounded">
                  {attendee.email}
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          <Button 
            onClick={sendMeetingInvite} 
            disabled={loading}
            className="w-full"
          >
            {loading ? '送信中...' : '会議依頼を送信する'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}