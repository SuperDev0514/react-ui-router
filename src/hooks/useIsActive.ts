/** @packageDocumentation @reactapi @module react_hooks */

import { StateDeclaration } from '@uirouter/core';
import { useEffect, useMemo, useState } from 'react';
import { UIRouterReact } from '../core';
import { useDeepObjectDiff } from './useDeepObjectDiff';
import { useOnStateChanged } from './useOnStateChanged';
import { useRouter } from './useRouter';
import { useViewContextState } from './useViewContextState';

/** @hidden */
function checkIfActive(
  router: UIRouterReact,
  stateName: string,
  params: object,
  relative: StateDeclaration,
  exact: boolean
) {
  return exact
    ? router.stateService.is(stateName, params, { relative })
    : router.stateService.includes(stateName, params, { relative });
}

/**
 * A hook that returns true if a given state is active.
 *
 * Example:
 * ```jsx
 * function ContactsLabel() {
 *  const isActive = useIsActive('contacts');
 *  return <span className={isActive ? 'active' : 'inactive'}>Contacts></span>
 * }
 * ```
 *
 * Example:
 * ```jsx
 * function JoeLabel() {
 *  const isActive = useIsActive('contacts.contact', { contactId: 'joe' });
 *  return <span className={isActive ? 'active' : 'inactive'}>Joe></span>
 * }
 * ```
 *
 * @param stateName the name of the state to check.
 *        Relative state names such as '.child' are supported.
 *        Relative states are resolved relative to the state that rendered the hook.
 * @param params if present, the hook will only return true if all the provided parameter values match.
 * @param exact when true, the hook returns true only when the state matches exactly.
 *        when false, returns true if the state matches, or any child state matches.
 */
export function useIsActive(stateName: string, params = null, exact = false) {
  const router = useRouter();
  const relative = useViewContextState(router);
  // Don't re-compute initialIsActive on every render
  const initialIsActive = useMemo(() => checkIfActive(router, stateName, params, relative, exact), []);
  const [isActive, setIsActive] = useState(initialIsActive);

  const checkIfActiveChanged = () => {
    const newIsActive = checkIfActive(router, stateName, params, relative, exact);
    if (newIsActive !== isActive) {
      setIsActive(newIsActive);
    }
  };

  useOnStateChanged(checkIfActiveChanged);
  useEffect(checkIfActiveChanged, [router, stateName, useDeepObjectDiff(params), exact]);

  return isActive;
}
