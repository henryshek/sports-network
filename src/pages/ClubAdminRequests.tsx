import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  clubId: string;
  clubName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ClubAdminRequestsProps {
  onBack?: () => void;
}

export function ClubAdminRequestsPage({ onBack }: ClubAdminRequestsProps) {
  const mockRequests: JoinRequest[] = [
    {
      id: 'req1',
      userId: 'user5',
      userName: 'Alice Johnson',
      userAvatar: '👩‍🦱',
      clubId: 'club1',
      clubName: 'SF Basketball Club',
      requestDate: '2026-04-05',
      status: 'pending',
    },
    {
      id: 'req2',
      userId: 'user6',
      userName: 'Bob Smith',
      userAvatar: '👨‍💼',
      clubId: 'club1',
      clubName: 'SF Basketball Club',
      requestDate: '2026-04-04',
      status: 'pending',
    },
    {
      id: 'req3',
      userId: 'user7',
      userName: 'Emma Davis',
      userAvatar: '👩‍🦳',
      clubId: 'club2',
      clubName: 'Tennis Lovers',
      requestDate: '2026-04-03',
      status: 'pending',
    },
  ];

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() => {
    const stored = localStorage.getItem('clubJoinRequests');
    return stored ? JSON.parse(stored) : mockRequests;
  });

  const saveRequests = (updatedRequests: JoinRequest[]) => {
    setJoinRequests(updatedRequests);
    localStorage.setItem('clubJoinRequests', JSON.stringify(updatedRequests));
  };

  const handleApprove = (requestId: string) => {
    const updatedRequests = joinRequests.map((req) =>
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    );
    saveRequests(updatedRequests);

    // Add user to club members
    const request = joinRequests.find((r) => r.id === requestId);
    if (request) {
      const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const updatedClubs = clubs.map((club: any) => {
        if (club.id === request.clubId && !club.members.includes(request.userId)) {
          return {
            ...club,
            members: [...club.members, request.userId],
          };
        }
        return club;
      });
      localStorage.setItem('clubs', JSON.stringify(updatedClubs));
    }
  };

  const handleReject = (requestId: string) => {
    const updatedRequests = joinRequests.map((req) =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    saveRequests(updatedRequests);
  };

  const pendingRequests = joinRequests.filter((r) => r.status === 'pending');
  const approvedRequests = joinRequests.filter((r) => r.status === 'approved');
  const rejectedRequests = joinRequests.filter((r) => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Club Join Requests</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">⏳</span> Pending Requests ({pendingRequests.length})
              </h2>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{request.userAvatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.userName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Requested to join <span className="font-medium">{request.clubName}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested on {request.requestDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Requests */}
          {approvedRequests.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✓</span> Approved ({approvedRequests.length})
              </h2>
              <div className="space-y-2">
                {approvedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg border border-green-200 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{request.userAvatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.userName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Approved to join {request.clubName}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✓ Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Requests */}
          {rejectedRequests.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✕</span> Rejected ({rejectedRequests.length})
              </h2>
              <div className="space-y-2">
                {rejectedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg border border-red-200 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{request.userAvatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.userName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Rejected from joining {request.clubName}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      ✕ Rejected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingRequests.length === 0 &&
            approvedRequests.length === 0 &&
            rejectedRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No join requests at this time
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
