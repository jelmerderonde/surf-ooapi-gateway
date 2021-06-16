/* Copyright (C) 2020 SURFnet B.V.
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

module.exports = {
  name: 'gatekeeper',

  schema: {
    $id: 'http://express-gateway.io/schemas/policies/surfnet-ooapi-gw-gatekeeper.json',
    type: 'object',
    properties: {
      apps: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          required: ['passwordSalt', 'passwordHash'],
          properties: {
            passwordSalt: { type: 'string' },
            passwordHash: { type: 'string' }
          }
        }
      },
      acls: {
        type: 'array',
        items: {
          type: 'object',
          required: ['app', 'endpoints'],
          properties: {
            app: { type: 'string' },
            endpoints: {
              type: 'array',
              items: {
                type: 'object',
                required: ['endpoint', 'paths'],
                properties: {
                  endpoint: { type: 'string' },
                  paths: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    required: ['acls', 'apps']
  },

  policy: require('./gatekeeper.js')
}
