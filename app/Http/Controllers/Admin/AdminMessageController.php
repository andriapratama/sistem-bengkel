<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMessageController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/messages/index');
    }

    public function getAll(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $messages = Message::paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Get all messages',
            'messages' => $messages,
        ], 200);
    }

    public function update($id)
    {
        $message = Message::find('id', $id);

        if (!$message) {
            return response()->json([
                'status' => false,
                'message' => 'Message not found.'
            ], 400);
        }

        $message->update([
            'status' => 1,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Message status updated'
        ], 200);
    }
}
